import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameCard } from '../../models/GameCard.model';
import { GameCards } from "../game-cards/game-cards";

@Component({
  selector: 'app-section-block',
  imports: [CommonModule, GameCards],
  templateUrl: './section-block.html',
  styleUrl: './section-block.css',
})
export class SectionBlock {
  @Output() productClick = new EventEmitter<any>();

  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() games: GameCard[] = [];
  @Input() showButton: boolean = false;
  @Input() columns: number = 5;
@Input() variant: 'default' | 'purple' = 'default';
onProductClick(game: any) {
  this.productClick.emit(game);
}
}
