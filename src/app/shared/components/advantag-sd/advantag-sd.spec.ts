import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvantagSd } from './advantag-sd';

describe('AdvantagSd', () => {
  let component: AdvantagSd;
  let fixture: ComponentFixture<AdvantagSd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvantagSd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvantagSd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
