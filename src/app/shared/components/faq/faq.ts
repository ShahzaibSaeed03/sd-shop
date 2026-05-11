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
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

 faqs = [
  {
    question: 'O que é recarga de jogos (Game Top-Up)?',
    answer: 'A recarga de jogos é um serviço que permite adicionar créditos diretamente na sua conta, como moedas, diamantes ou outros recursos dentro do jogo. Na <strong class="text-purple-600">SDShop</strong>, esse processo é feito de forma rápida e segura, garantindo que os itens cheguem corretamente após o pagamento.',
    open: true
  },
  {
    question: 'Como funcionam as recargas de jogos?',
    answer: 'O processo é simples: você informa sua UID/ID do jogador ou servidor, escolhe o produto desejado e realiza o pagamento. Após a confirmação, a recarga é processada automaticamente e os itens são enviados diretamente para sua conta no jogo.',
    open: false
  },
  {
    question: 'É seguro fazer recargas na SD Shop?',
    answer: 'Sim, é seguro. A <strong class="text-purple-600">SDShop</strong> utiliza processos confiáveis e trabalha com fornecedores qualificados, garantindo que as transações sejam realizadas com segurança e que os créditos sejam entregues corretamente na sua conta.',
    open: false
  },
  {
    question: 'Posso recarregar qualquer jogo?',
    answer: 'A <strong class="text-purple-600">SDShop</strong> oferece suporte para diversos jogos populares, com novas opções sendo adicionadas constantemente. Recomendamos verificar a lista de jogos disponíveis na plataforma antes de realizar sua compra.',
    open: false
  },
  {
    question: 'O que acontece se eu inserir o ID do jogador incorreto?',
    answer: 'Caso o ID informado esteja incorreto, a recarga pode ser enviada para a conta errada e não poderá ser revertida. Por isso, é muito importante revisar todas as informações antes de finalizar o pagamento. Se tiver dúvidas, entre em contato com o suporte antes de concluir a compra.',
    open: false
  }
];

  toggle(faq: any) {
    faq.open = !faq.open;
  }
}