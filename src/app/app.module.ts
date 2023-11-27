import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { LoginComponent } from './login/login.component';
import { ItemRemoveComponent } from './item-remove/item-remove.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListLaborComponent } from './components/list-labor/list-labor.component';
import { AddEditLaborComponent } from './components/add-edit-labor/add-edit-labor.component';
import { ListAutoevaluacionComponent } from './components/list-autoevaluacion/list-autoevaluacion.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { AddItemUsuarioComponent } from './components/add-item-usuario/add-item-usuario.component';

import { ToastrModule } from 'ngx-toastr';
import { AddEditUsuarioComponent } from './components/add-edit-usuario/add-edit-usuario.component';
import { ListDocentesComponent } from './components/list-docentes/list-docentes.component';


@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemAddComponent,
    ItemEditComponent,
    LoginComponent,
    ItemRemoveComponent,
    NavbarComponent,
    ListLaborComponent,
    AddEditLaborComponent,
    ListAutoevaluacionComponent,
    ListItemComponent,
    AddItemUsuarioComponent,
    AddEditUsuarioComponent,
    ListDocentesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
