import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GameCard } from '../../models/GameCard.model';
import { GameCards } from "../game-cards/game-cards";

@Component({
  selector: 'app-section-block',
  imports: [CommonModule, GameCards],
  templateUrl: './section-block.html',
  styleUrl: './section-block.css',
})
export class SectionBlock implements OnChanges {
  @Output() productClick = new EventEmitter<any>();

  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() games: GameCard[] = [];
  @Input() showButton: boolean = false; 
  @Input() columns: number = 5;
  @Input() variant: 'default' | 'purple' = 'default';

  itemsPerPage: number = 10;
  visibleCount: number = this.itemsPerPage;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['games']) {
      this.visibleCount = this.itemsPerPage;
    }
  }

  get visibleGames(): GameCard[] {
    return this.games.slice(0, this.visibleCount);
  }

  get canShowMore(): boolean {
    return this.games.length > this.visibleCount;
  }

  onShowMore(): void {
    this.visibleCount += this.itemsPerPage;
  }

  onProductClick(game: any) {
    this.productClick.emit(game);
  }
}