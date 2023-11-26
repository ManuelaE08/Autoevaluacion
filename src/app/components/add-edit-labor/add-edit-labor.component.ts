import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Labor } from 'src/app/interfaces/labor';
import { LaborService } from 'src/app/services/labor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoLabor } from 'src/app/interfaces/tipoLabor';
import swal from 'sweetalert2';

// or via CommonJS

@Component({
  selector: 'app-add-edit-labor',
  templateUrl: './add-edit-labor.component.html',
  styleUrls: ['./add-edit-labor.component.css']
})
export class AddEditLaborComponent implements OnInit{

  alerta:string='';
  tipoLabor: TipoLabor[] = [{
    id: 1,
    codigo: 'D',
    descripcion: 'Docencia'
  },{
    id: 2,
    codigo: 'TD',
    descripcion: 'Trabajos Docencia'
  },{
    id: 3,
    codigo: 'PI',
    descripcion: 'Proyectos Investigación'
  },{
    id: 4,
    codigo: 'TI',
    descripcion: 'Trabajos Investigación'
  },{
    id: 5,
    codigo: 'AD',
    descripcion: 'Administración'
  },{
    id: 6,
    codigo: 'AS',
    descripcion: 'Asesoría'
  },{
    id: 7,
    codigo: 'S',
    descripcion: 'Servicios'
  },{
    id: 8,
    codigo: 'E',
    descripcion: 'Extensión'
  },{
    id: 9,
    codigo: 'C',
    descripcion: 'Capacitación'
  },{
    id: 10,
    codigo: 'OS',
    descripcion: 'Otros Servicios'
  }];
  formLabor: FormGroup;
  id:number;
  operacion: string = 'Agregar ';

  constructor(private fb: FormBuilder,
    private router :Router,
    private aRouter: ActivatedRoute,
    private _laborService: LaborService){
    this.formLabor = this.fb.group({
      tipLabId: [null, Validators.required],
      nombreLab: ['', Validators.required],
      horasLab: [null, Validators.required]
    })
    this.id = Number( aRouter.snapshot.paramMap.get('id'));
    console.log(this.id);
  }

  ngOnInit(): void {
    if(this.id != 0){
      this.operacion= 'Editar ';
      this.getLabor(this.id);
    }
  }

  getLabor(id:number){
    this._laborService.getLabor(id).subscribe((data: Labor) =>{
      const lab: Labor = this.convertirLabor(data);
      this.formLabor.setValue({
        tipLabId: lab.idTipoLabor,
        nombreLab: lab.nombre,
        horasLab: lab.horas
      })
    })
  }

  addLabor(){
    console.log(this.formLabor.value.tipLabId);
    
    
    
    const labor: Labor = {
      idTipoLabor: this.formLabor.value.tipLabId ,
      nombre: this.formLabor.value.nombreLab,
      horas: this.formLabor.value.horasLab
    }
    if(this.id !== 0){
      //Editar 
      labor.id = this.id;
      this._laborService.updateLabor(labor).subscribe(()=>{
        console.log('labor update');
        this.router.navigate(['/labor']);
        swal.fire('Se editó  '+ labor.nombre+ ' con éxito', this.alerta, 'success');
      })
    }else{
      //AGregar
      this._laborService.saveLabor(labor).subscribe(() => {
        console.log('labor agregada');
        this.router.navigate(['/labor']);
        swal.fire('Se registró '+ labor.nombre+ ' con éxito', this.alerta, 'success');
      })
    }
    
  }

  convertirLabor(labor: any): Labor{
    let resultado: Labor =({
      id: labor[0].atrLabID,
      idTipoLabor: labor[0].atrTlID,
      nombre: labor[0].atrLabNombre,
      horas: labor[0].atrLabHoras
    });
    return resultado;
  }
}
