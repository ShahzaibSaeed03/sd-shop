import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecord } from './order-record';

describe('OrderRecord', () => {
  let component: OrderRecord;
  let fixture: ComponentFixture<OrderRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
