import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLaborComponent } from './list-labor.component';

describe('ListLaborComponent', () => {
  let component: ListLaborComponent;
  let fixture: ComponentFixture<ListLaborComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLaborComponent]
    });
    fixture = TestBed.createComponent(ListLaborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
