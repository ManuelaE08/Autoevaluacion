import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Periodo } from 'src/app/interfaces/periodo';
import { UsuRol } from 'src/app/interfaces/usu-rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Rol } from '../../interfaces/rol';
import { UsuRolService } from '../../services/usu-rol.service';

//const bcrypt = require('bcrypt');

@Component({
  selector: 'app-add-edit-usuario',
  templateUrl: './add-edit-usuario.component.html',
  styleUrls: ['./add-edit-usuario.component.css']
})
export class AddEditUsuarioComponent implements OnInit{
  listRoles: Rol[] = [];
  perido: Periodo = {PER_ID: 1, PER_NOMBRE: '2023-2', fechaInicio: new Date(), fechaFin: new Date()}

  use_rol: any;

  listGeneros: string[] = ['Masculino', 'Femenino', 'Otro'];
  form: FormGroup;
 // loading: boolean = true;
  id: number;
  id_rol: number;
  operacion: string = 'Agregar ';
  password: string  = '';
  genre: string = '';
  user: any;

  id_usua_aux: any;
  id_rol_aux: any;


  constructor(private fb: FormBuilder,
    private router: Router, private _rolService: RolService, private _usuRolService: UsuRolService,
    private aRouter: ActivatedRoute, private _usuarioService: UsuarioService, private toastr: ToastrService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      id: [null, Validators.required],
      genero: ['', Validators.required],
      tipoDocentes: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      ultTituloAlcanzado: ['', Validators.required]
    }),
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.id_rol = Number(aRouter.snapshot.paramMap.get('tipoDocentes.id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.operacion = 'Editar ';
      this.getDocente(this.id);
    }
    this.getRoles();
  }

  getRoles(){
    this._rolService.getRoles().subscribe((data: Rol[]) => {
      this.listRoles = this.convertirRoles(data);
    });
  }

  getDocente(id: number) {
   // this.loading = true;
    this._usuarioService.getUsuario(id).subscribe((data) => {
      data = this.convertirUsuario(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        id: data.id,
        genero: data.genero,
        tipoDocentes: '',
        correo: data.correo,
        ultTituloAlcanzado: data.estudio,
      })
    })
  }
  
  addUsuRol() {
    const usuRol: UsuRol = {
      usr_identificaodor: this.id_usua_aux,
      rol_id: this.id_rol_aux,
      ur_fechaInicio: this.perido.fechaInicio,
      ur_fechaFin: this.perido.fechaFin
    }
    
    this.use_rol = usuRol;
    console.log(this.use_rol);
    console.log(this.id_rol);
    if (this.id_rol !== 0) {
      // Es editar 
      usuRol.usr_identificaodor = this.id; 
      usuRol.rol_id = this.id_rol;  
      this._usuRolService.updateUsuRol(this.use_rol).subscribe(() => {
        this.toastr.info('El Rol de usuario'+this.use_rol +' fue actualizado con exito', 'Rol de usuario actualizado');
        this.router.navigate(['inicio']);
      })
    }else {
      // Es agregar
      this._usuRolService.saveUsuRol(this.use_rol).subscribe(() => {
        this.toastr.success('El Rol de usuario'+this.use_rol+' fue registrado con exito', 'Rol de usuario registrado');
        this.router.navigate(['inicio']);
      })
    }
  }


  addUsuario() {
    this.password = this.form.value.id.toString();
    if (this.form.value.genero.includes("Masculino") || this.form.value.genero.includes("Femenino")) {
      this.genre = this.form.value.genero.charAt(0);
    }
    this.id_usua_aux = this.form.value.id;
    this.id_rol_aux = this.form.value.tipoDocentes.id;
    const usuario: Usuario = {
      id: this.form.value.id,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      genero: this.genre,
      estudio: this.form.value.ultTituloAlcanzado,
      correo: this.form.value.correo,
      contrasenia: this.password, 
    }
    this.user = usuario;
    if (this.id !== 0) {
      // Es editar 
      usuario.id = this.id;  
      this._usuarioService.updateUsuario(this.user).subscribe(() => {
        this.toastr.info('El usuario'+this.user.nombre+' fue actualizado con exito', 'Usuario actualizado');
        this.router.navigate(['inicio']);
      })
    }else {
      // Es agregar
      this._usuarioService.saveUsuario(this.user).subscribe(() => {
        this.toastr.success('El Usuario'+this.user.nombre+' fue registrado con exito', 'Usuario registrado');
        this.router.navigate(['inicio']);
      })
    }
    this.addUsuRol();
  }


  convertirUsuRol(usurol: UsuRol): any {
    let resultado: any = ({
      atr_identificacion: usurol.usr_identificaodor,
      atr_id: usurol.rol_id,
      atr_fechaInicio: usurol.ur_fechaInicio,
      atr_fechaFin: usurol.ur_fechaFin
      });
    return resultado;
  }

  convertirRoles(roles: any): Rol[] {
    let resultado: Rol[]= [];
    for (let rol of roles) {
      resultado.push({
        id: rol.atr_id,
        descripcion: rol.atr_descripcion,
        tipo: rol.atr_tipo
      });
    }
    return resultado;
  }

  convertirUsuario(usuario: any): Usuario {
    let resultado: Usuario = ({
        id: usuario.atr_Identificacion,
        nombre: usuario.atr_nombre,
        apellido: usuario.atr_apellido,
        genero: usuario.atr_genero,
        estudio: usuario.atr_estudio,
        correo: usuario.atr_correo,
        contrasenia: usuario.atr_contrasenia
      });
    return resultado;
  }

}
