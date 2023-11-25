import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Labor } from 'src/app/interfaces/labor';
import { LaborService } from 'src/app/services/labor.service';

@Component({
  selector: 'app-add-item-usuario',
  templateUrl: './add-item-usuario.component.html',
  styleUrls: ['./add-item-usuario.component.css']
})
export class AddItemUsuarioComponent implements OnInit {
  id_usuario: number;
  listLabores: Labor[] = []
  constructor(private _laborService: LaborService,
    private router :Router,
    private aRouter: ActivatedRoute
    ){
    this.id_usuario = Number(aRouter.snapshot.paramMap.get('id'));
    console.log('id usuario para añadir item',this.id_usuario);
  }

  ngOnInit(): void {
    this.getListLabores();
  }

  getListLabores(){
    this._laborService.getListLabores().subscribe((data: Labor[]) =>{
      this.listLabores = this.convertirLabores(data);
    })
  }
  convertirLabores(labores: any): Labor[]{
    let resultado: Labor[] =[];
    for(let labor of labores){
      resultado.push({
        id: labor.atrLabID,
        idTipoLabor: labor.atrTlID,
        nombre: labor.atrLabNombre,
        horas: labor.atrLabHoras
      });
    }
    return resultado;
  }
}
