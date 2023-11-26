import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemRemoveComponent } from './item-remove/item-remove.component';
import { LoginComponent } from './login/login.component';
import { ListLaborComponent } from './components/list-labor/list-labor.component';
import { AddEditLaborComponent } from './components/add-edit-labor/add-edit-labor.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListAutoevaluacionComponent } from './components/list-autoevaluacion/list-autoevaluacion.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { AddItemUsuarioComponent } from './components/add-item-usuario/add-item-usuario.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inicio', component: NavbarComponent},
  { path: 'login', component: LoginComponent },
  { path: 'labor', component: ListLaborComponent},
  { path: 'labor/add', component: AddEditLaborComponent},
  { path: 'labor/edit/:id', component: AddEditLaborComponent},
  { path: 'autoevaluacion', component: ListAutoevaluacionComponent},
  { path: 'autoevaluacion/:uid', component: ListItemComponent},
  { path: 'autoevaluacion/:uid/item/add', component: AddItemUsuarioComponent},
  { path: '**', redirectTo: '/items' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
