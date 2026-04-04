import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListingPage } from './product-listing-page';

describe('ProductListingPage', () => {
  let component: ProductListingPage;
  let fixture: ComponentFixture<ProductListingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
