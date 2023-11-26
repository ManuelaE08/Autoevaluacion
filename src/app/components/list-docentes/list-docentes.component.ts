import { Component, OnInit } from '@angular/core';

import { UsuRol } from 'src/app/interfaces/usu-rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { RolService } from 'src/app/services/rol.service';
import { UsuRolService } from 'src/app/services/usu-rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Rol } from '../../interfaces/rol';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-docentes',
  templateUrl: './list-docentes.component.html',
  styleUrls: ['./list-docentes.component.css']
})
export class ListDocentesComponent implements OnInit {
  listDocentes: Usuario[] = [];
  listRoles: Rol[] = [];
  listUseRoles: UsuRol[] = [];
  auxIdRol: number = 0;

  constructor(private _usuarioService: UsuarioService,
    private _rolService: RolService,
    private _useRolServise: UsuRolService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getListDocentes();
    this.getListRoles();
    this.getListUseRoles();
  }

  getListDocentes() {
    this._usuarioService.getListUsuarios().subscribe((data: Usuario[]) => {
      this.listDocentes = this.convertirUsuarios(data);
    });
  }

  getListRoles(){
    this._rolService.getRoles().subscribe((data: Rol[]) =>{
      this.listRoles = this.convertirRoles(data);
    })
  }
  
  getListUseRoles(){
    this._useRolServise.getUsuRoles().subscribe((data: UsuRol[]) =>{
      this.listUseRoles = this.convertirUsuRoles(data);
    })
  }

  deleteRolDocente(id: number){
    this.auxIdRol = this.obtenerIDRol(id);
    this._useRolServise.deleteUsuRol(id, this.auxIdRol).subscribe(() => {
      this.getListDocentes();
      this.toastr.warning('El rol del usuario fue eliminado con exito', 'Use-rol eliminado');
    });
    this.deleteDocente(id);
  }

  deleteDocente(id: number) {
    this._usuarioService.deleteUsuario(id).subscribe(() => {
      this.getListDocentes();
      this.toastr.warning('El usuario fue eliminado con exito', 'Usuario eliminado');
    })
  }

  obtenerIDRol(idUsuario: number): number {
    let rolUsuario = this.listUseRoles.find(ur => ur.usr_identificaodor == idUsuario);

    if (!rolUsuario) {
        return 0;
    }
    let rol = this.listRoles.find(r => r.id == rolUsuario?.rol_id); 
    return rol ? rol.id : 0;
  }

  obtenerRolDeUsuario(idUsuario: number): string | null {
    let rolUsuario = this.listUseRoles.find(ur => ur.usr_identificaodor == idUsuario);

    if (!rolUsuario) {
        return null;
    }
    let rol = this.listRoles.find(r => r.id == rolUsuario?.rol_id); 
    return rol ? rol.tipo : null;
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

  convertirUsuRoles(usuRoles: any): UsuRol[] {
    let resultado: UsuRol[]= [];
    for (let rol of usuRoles) {
      resultado.push({
        usr_identificaodor: rol.atr_identificacion,
        rol_id: rol.atr_id,
        ur_fechaInicio: rol.atr_fecha_inicio,
        ur_fechaFin: rol.atr_fecha_fin
      });
    }
    return resultado;
  }

  convertirUsuarios(usuarios: any): Usuario[] {
    let resultado: Usuario[]= [];
    for (let usuario of usuarios) {
      resultado.push({
        id: usuario.atr_Identificacion,
        nombre: usuario.atr_nombre,
        apellido: usuario.atr_apellido,
        genero: usuario.atr_genero,
        estudio: usuario.atr_estudio,
        correo: usuario.atr_correo,
        contrasenia: usuario.atr_contrasenia
      });
    }
    return resultado;
  }
}
