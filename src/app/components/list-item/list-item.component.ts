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
  items: any[] = [];
  mostrarContenido: boolean = false;

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
      this.itemService.subirEvidencia(this.id_usuario, ieva_id, archivo).subscribe(
        (response) => {
          console.log('Evidencia subida exitosamente:', response);
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
      this.descargarArchivo(ieva_id);
    } else if (tipo === 0) {
      console.log('Contenido de texto:', contenido);
      this.mostrarContenido = true;
    } else {
      console.error('Tipo de evidencia no reconocido:', tipo);
    }
  }

  private descargarArchivo(ieva_id: number) {
    this.itemService.descargarEvidencia(this.id_usuario, ieva_id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
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
  }

  editarItem(ieva_id: number) {
    this.router.navigate(['/autoevaluacion', this.id_usuario, 'item', 'edit', ieva_id]);
  }

}
