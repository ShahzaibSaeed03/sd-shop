import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabItem } from '../../models/tab-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab-menu',
  imports: [CommonModule,FormsModule],
  templateUrl: './tab-menu.html',
  styleUrl: './tab-menu.css',
})
export class TabMenu {
@Input() tabs: TabItem[] = [];
  @Input() activeTab!: string;

  @Output() tabChange = new EventEmitter<string>();

  selectTab(tab: TabItem) {
    this.activeTab = tab.value;
    this.tabChange.emit(tab.value);
  }
}
