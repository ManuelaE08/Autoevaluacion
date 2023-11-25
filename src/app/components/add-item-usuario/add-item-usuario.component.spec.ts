import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemUsuarioComponent } from './add-item-usuario.component';

describe('AddItemUsuarioComponent', () => {
  let component: AddItemUsuarioComponent;
  let fixture: ComponentFixture<AddItemUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemUsuarioComponent]
    });
    fixture = TestBed.createComponent(AddItemUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
