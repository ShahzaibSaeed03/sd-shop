import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessPayment } from './sucess-payment';

describe('SucessPayment', () => {
  let component: SucessPayment;
  let fixture: ComponentFixture<SucessPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucessPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
