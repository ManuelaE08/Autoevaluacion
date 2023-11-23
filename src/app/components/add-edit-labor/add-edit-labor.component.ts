import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Labor } from 'src/app/interfaces/labor';
import { LaborService } from 'src/app/services/labor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-labor',
  templateUrl: './add-edit-labor.component.html',
  styleUrls: ['./add-edit-labor.component.css']
})
export class AddEditLaborComponent implements OnInit{
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
      idTipoLabor: this.formLabor.value.tipLabId,
      nombre: this.formLabor.value.nombreLab,
      horas: this.formLabor.value.horasLab
    }
    if(this.id !== 0){
      //Editar 
      labor.id = this.id;
      this._laborService.updateLabor(labor).subscribe(()=>{
        console.log('labor update');
        this.router.navigate(['/labor']);
      })
    }else{
      //AGregar
      this._laborService.saveLabor(labor).subscribe(() => {
        console.log('labor agregada');
        this.router.navigate(['/labor']);
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
