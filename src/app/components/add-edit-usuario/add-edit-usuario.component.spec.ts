import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsuarioComponent } from './add-edit-usuario.component';

describe('AddEditDocenteComponent', () => {
  let component: AddEditUsuarioComponent;
  let fixture: ComponentFixture<AddEditUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditUsuarioComponent]
    });
    fixture = TestBed.createComponent(AddEditUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
