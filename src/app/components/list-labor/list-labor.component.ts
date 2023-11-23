import { Component, OnInit } from '@angular/core';
import { Labor } from 'src/app/interfaces/labor';
import { LaborService } from 'src/app/services/labor.service';

@Component({
  selector: 'app-list-labor',
  templateUrl: './list-labor.component.html',
  styleUrls: ['./list-labor.component.css']
})
export class ListLaborComponent implements OnInit {
  listLabores: Labor[] = []
  constructor(private _laborService: LaborService){}

  ngOnInit(): void {
    this.getListLabores();
  }

  getListLabores(){
    this._laborService.getListLabores().subscribe((data: Labor[]) =>{
      this.listLabores = this.convertirLabores(data);
    })
  }

  deleteLabor(id: number){
    this._laborService.deleteLabor(id).subscribe(() =>{
      this.getListLabores();
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

  convertirLabor(labor: any): Labor{
    let resultado: Labor =({
      id: labor.atrLabID,
      idTipoLabor: labor.atrTlID,
      nombre: labor.atrLabNombre,
      horas: labor.atrLabHoras
    });
    return resultado;
  }
}
