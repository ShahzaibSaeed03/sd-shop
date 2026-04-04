import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameCard } from '../../models/GameCard.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-cards',
  imports: [CommonModule],
  templateUrl: './game-cards.html',
  styleUrl: './game-cards.css',
})
export class GameCards {
  @Input() data!: GameCard;
@Output() cardClick = new EventEmitter<any>();

onClick() {
  this.cardClick.emit(this.data);
}
}
