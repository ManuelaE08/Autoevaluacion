import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLaborComponent } from './add-edit-labor.component';

describe('AddEditLaborComponent', () => {
  let component: AddEditLaborComponent;
  let fixture: ComponentFixture<AddEditLaborComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditLaborComponent]
    });
    fixture = TestBed.createComponent(AddEditLaborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
