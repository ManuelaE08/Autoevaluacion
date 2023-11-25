import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit{
  id_usuario: number;
  constructor(private router :Router,
    private aRouter: ActivatedRoute){
      //obtenemos el id del usuario que del que vamos a realizar la autoevalucion 
      this.id_usuario = Number(aRouter.snapshot.paramMap.get('id'));
      console.log('id usuario',this.id_usuario);
  }
  ngOnInit(): void {
  
  }

  getItemsAutoevaluacion(){
    //obtemos id de la utoevaluacion con el usuario y luego con el id de la autoevalucion obtenemos los items 
    //select * from item_evaluacion where (select eva_id from evaluacion where usr_identificacion = 1); puede servir esta consulta
  }
}
