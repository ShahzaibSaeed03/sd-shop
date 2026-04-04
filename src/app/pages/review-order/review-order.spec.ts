import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOrder } from './review-order';

describe('ReviewOrder', () => {
  let component: ReviewOrder;
  let fixture: ComponentFixture<ReviewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
