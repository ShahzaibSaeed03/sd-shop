import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
aChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  faqs = [
    {
      question: 'What is Game Top-Up?',
      answer: 'Game top-up is a service that allows you to instantly recharge your game wallet or buy in-game currency such as diamonds, coins, or UC for your favorite games.',
      open: true
    },
    { question: 'How does game top-up work?', answer: 'You select game, enter ID, choose amount and pay.', open: false },
    { question: 'Is game top-up safe?', answer: 'Yes, all transactions are secure.', open: false },
    { question: 'Can I top up for any game?', answer: 'Depends on supported games.', open: false },
    { question: 'What if I enter the wrong Player ID?', answer: 'Please double-check before confirming.', open: false }
  ];

  toggle(faq: any) {
    faq.open = !faq.open;
  }
}
