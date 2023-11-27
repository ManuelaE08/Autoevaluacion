import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  ieva_id: number;
  item: any = {};
  isCoordinator!: boolean;
  isDocent!: boolean;
  userRole!: string | null;
  usr_identificacion!: number | null;

  constructor(
    private router: Router,
    private aRouter: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private itemService: ItemService
  ) {
    this.ieva_id = Number(aRouter.snapshot.paramMap.get('ieva_id'));
  }

  ngOnInit(): void {
    this.getItem();

    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwtDecode(token);

      this.userRole = decodedToken.rol;
      this.isCoordinator = this.userRole === 'coordinador';
      this.isDocent = this.userRole === 'docente';

      // Asegúrate de que la propiedad userId esté definida en decodedToken
      if (decodedToken.userId !== undefined) {
        this.usr_identificacion = decodedToken.userId; // Asignamos el valor a usr_identificacion
      } else {
        console.error('userId no está definida en decodedToken.');
      }

      console.log('Rol del usuario:', this.userRole);
      console.log('Contenido del token decodificado:', decodedToken);
    } else {
      console.error('Token no encontrado en el almacenamiento local.');
    }
  }

  canEditField(fieldName: string): boolean {
    if (this.isDocent) {
      return fieldName === 'IEVA_PUNTAJE';
    } else if (this.isCoordinator) {
      return true;
    }
    return false;
  }

  getItem() {
    if (this.ieva_id) {
      this.itemService.getItem(this.ieva_id).subscribe(
        (item) => {
          if (item) {
            this.item = item;
            console.log('Item obtenido:', this.item);
          } else {
            console.error('No se encontró el item con ID:', this.ieva_id);
          }
        },
        (error) => {
          console.error('Error al obtener el item:', error);
        }
      );
    } else {
      console.error('ID de item no válido:', this.ieva_id);
    }
  }

  guardarCambios() {
    const editedItem = {
      Lab_Id: this.item.LAB_ID,
      Eva_Id: this.item.EVA_ID,
      Ieva_Acto: this.item.IEVA_ACTO,
      Ieva_Estado: this.item.IEVA_ESTADO,
      Ieva_Puntaje: this.item.IEVA_PUNTAJE
    };

    // Clonar el objeto antes de pasarlo al servicio
    const editedItemCopy = { ...editedItem };

    this.itemService.editItem(this.ieva_id, editedItemCopy).subscribe(
      (response) => {
        console.log('Item actualizado exitosamente:', response);

        // Verificar si this.usr_identificacion está definido antes de navegar
        if (this.usr_identificacion) {
          this.router.navigate(['/autoevaluacion', this.usr_identificacion]);
        } else {
          console.error('La propiedad USR_IDENTIFICACION no está definida.');
        }
      },
      (error) => {
        console.error('Error al actualizar el item:', error);
      }
    );
  }



  canUploadFile(): boolean {
    return this.isDocent && this.item.ROL_DESCRIPCION === 'catedratico';
  }

  subirEvidencia(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const archivo = files[0];
      this.itemService.subirEvidencia(this.item.USR_IDENTIFICACION, this.ieva_id, archivo).subscribe(
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
}

    /* <div class="mb-3">
      <!-- logica para evidencias -->
      <ng-container *ngIf="item.EVI_TIPO === 1">
        <label for="evidenciaArchivo" class="form-label">Subir Evidencia</label>
        <input *ngIf="canUploadFile()" type="file" class="form-control" id="evidenciaArchivo" (change)="subirEvidencia($event)">
      </ng-container>
      <ng-container *ngIf="item.EVI_TIPO === 0">
        <label for="evidenciaTexto" class="form-label">Contenido de Texto</label>
        <div>{{ item.EVI_CONTENIDO }}</div>
      </ng-container>
    </div> */
