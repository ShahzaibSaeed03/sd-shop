import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-advantag-sd',
  imports: [CommonModule],
  templateUrl: './advantag-sd.html',
  styleUrl: './advantag-sd.css',
})
export class AdvantagSd {
  @Input() variant: 'default' | 'listing' = 'default';

  items = [
    {
      title: 'Recarga Instantânea',
      desc: 'Receba seus itens em poucos segundos após a confirmação do pagamento, sem complicações ou espera desnecessária.',
      icon: 'cards/icon1.png',
      bgImage: 'cards/bg1.png',
      highlight: true
    },
    {
      title: 'Transações Seguras',
      desc: 'Todos os pedidos passam por um sistema seguro e verificado, garantindo proteção total durante todo o processo de compra.',
      icon: 'cards/icon2.png',
      bgImage: 'cards/bg2.png'
    },
    {
      title: 'Ampla Variedade de Jogos',
      desc: 'Explore um catálogo completo com mais de 30 títulos disponíveis.',
      icon: 'cards/icon3.png',
      bgImage: 'cards/bg3.png'
    },
    {
      title: 'Créditos Confiáveis',
      desc: 'Entrega rápida e segura diretamente na sua conta, sem complicações.',
      icon: 'cards/icon4.png',
      bgImage: 'cards/bg4.png'
    },
    {
      title: 'Benefícios a cada compra',
      desc: 'Seja recompensado com cashback e acumule SD Coins para usar em compras futuras.',
      icon: 'cards/icon5.png',
      bgImage: 'cards/bg5.png'
    },
    {
      title: 'Pagamentos Facilitados',
      desc: 'Pague com Pix ou cartão de crédito, com opção de parcelamento para maior flexibilidade.',
      icon: 'cards/icon6.png',
      bgImage: 'cards/bg6.png'
    }
  ];

}