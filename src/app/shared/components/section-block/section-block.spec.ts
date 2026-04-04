import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionBlock } from './section-block';

describe('SectionBlock', () => {
  let component: SectionBlock;
  let fixture: ComponentFixture<SectionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
