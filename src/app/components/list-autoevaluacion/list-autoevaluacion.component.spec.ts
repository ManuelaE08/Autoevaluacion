import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAutoevaluacionComponent } from './list-autoevaluacion.component';

describe('ListAutoevaluacionComponent', () => {
  let component: ListAutoevaluacionComponent;
  let fixture: ComponentFixture<ListAutoevaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAutoevaluacionComponent]
    });
    fixture = TestBed.createComponent(ListAutoevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
