import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCards } from './game-cards';

describe('GameCards', () => {
  let component: GameCards;
  let fixture: ComponentFixture<GameCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
