import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  id_usuario: number;
  items!: any[];

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private itemService: ItemService
  ) {
    this.id_usuario = Number(aRouter.snapshot.paramMap.get('uid'));
    console.log('id usuario', this.id_usuario);
  }

  ngOnInit(): void {
    this.getItemsAutoevaluacion();
  }

  getItemsAutoevaluacion() {
    if (this.id_usuario) {
      this.itemService.getItemsAutoevaluacion(this.id_usuario).subscribe(
        (items) => {
          console.log('Items de autoevaluación obtenidos:', items);
          this.items = items;
        },
        (error) => {
          console.error('Error al obtener items de autoevaluación:', error);
        }
      );
    } else {
      console.error('ID de usuario no válido:', this.id_usuario);
    }
  }

  subirEvidencia(ieva_id: number, event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const archivo = files[0];
      this.itemService.subirEvidencia(ieva_id, archivo).subscribe(
        (response) => {
          console.log('Evidencia subida exitosamente:', response);
          // Puedes realizar alguna acción adicional si es necesario
        },
        (error) => {
          console.error('Error al subir evidencia:', error);
        }
      );
    } else {
      console.error('No se seleccionó ningún archivo.');
    }
  }

  descargarEvidencia(ieva_id: number, tipo: number, contenido: string) {
    if (tipo === 1) {
      // Descargar archivo (contenido es la dirección)
      this.itemService.descargarEvidencia(ieva_id).subscribe(
        (response) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = `evidencia_${ieva_id}.zip`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error al descargar evidencia:', error);
        }
      );
    } else if (tipo === 0) {
      // Mostrar contenido de texto (contenido es el texto)
      console.log('Contenido de texto:', contenido);
      // Puedes mostrar el contenido en un modal o en la forma que desees
    } else {
      console.error('Tipo de evidencia no reconocido:', tipo);
    }
  }
}
