import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRemoveComponent } from './item-remove.component';

describe('ItemRemoveComponent', () => {
  let component: ItemRemoveComponent;
  let fixture: ComponentFixture<ItemRemoveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemRemoveComponent]
    });
    fixture = TestBed.createComponent(ItemRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
