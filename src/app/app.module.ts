import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
