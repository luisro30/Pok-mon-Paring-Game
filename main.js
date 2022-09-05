class Soundtrack {
  constructor() {
      this.sonido_principal = new Audio('recursos/Audio/principal.mp3');
      this.sonido_volteo = new Audio('recursos/Audio/volteo.mp3');
      this.sonido_acertar = new Audio('recursos/Audio/acertar.mp3');
      this.sonido_ganar = new Audio('recursos/Audio/ganar.mp3');
      this.sonido_principal.volume = 0.5;
      this.sonido_principal.loop = true;
  }
  ingame() {
      this.sonido_principal.play();
      this.sonido_principal.currentTime = 0;
  }
  voltear() {
      this.sonido_volteo.play();
      this.sonido_volteo.currentTime = 0;
  }
  acertar() {
      this.sonido_acertar.play();
      this.sonido_acertar.currentTime = 0;
  }
  victoria() {
      this.sonido_principal.pause();
      this.sonido_acertar.pause();
      this.sonido_ganar.play();
  }
}

class Partida {
    
  constructor(cards) {
      this.cardsArray = cards;
      this.soundtrack = new Soundtrack();
  }

  empezar_juego() {
      this.comprobar = null;
      this.parejas_encontradas = [];
      this.busy = true;
      this.soundtrack.ingame();
      setTimeout(() => {
          this.mezclar(this.cardsArray);
          this.busy = false;      
      }, 500)
      this.ocultar();
  }

  ganar() {
      this.soundtrack.victoria();
      
      setTimeout(() => 
      {
        alert("Partida Terminada");    
      }, 500);

      setTimeout(() => {
        CargarPartida();
    }, 10 * 1000);

  }

  ocultar() {
      this.cardsArray.forEach(card => {
          card.classList.remove('visible');
          card.classList.remove('matched');
      });
  }

  voltear_carta(card) {
      if(this.volteable(card)) {
          this.soundtrack.voltear();
          card.classList.add('visible');

          if(this.comprobar) {
              this.comprobar_pareja(card);
          } else {
              this.comprobar = card;
          }
      }
  }
  
  comprobar_pareja(card) {
      if(this.obtener_carta(card) === this.obtener_carta(this.comprobar))
          this.acertada(card, this.comprobar);
      else 
          this.no_acertada(card, this.comprobar);

      this.comprobar = null;
  }

  acertada(card1, card2) {
      this.parejas_encontradas.push(card1);
      this.parejas_encontradas.push(card2);
      card1.classList.add('matched');
      card2.classList.add('matched');
      this.soundtrack.acertar();
      if(this.parejas_encontradas.length === this.cardsArray.length)
          this.ganar();
  }

  no_acertada(card1, card2) {
    this.busy = true;
      setTimeout(() => {
          card1.classList.remove('visible');
          card2.classList.remove('visible');
          this.busy = false;
      }, 1000);
  }

  mezclar(cardsArray) {
      for (let c = cardsArray.length - 1; c > 0; c--) {
          let posicion = Math.floor(Math.random() * (c + 1));
          cardsArray[posicion].style.order = c;
          cardsArray[c].style.order = posicion;
      }
  }

  obtener_carta(card) {
      return card.getElementsByClassName('frontal')[0].src;
  }

  volteable(card) {
      return !this.busy &&  !this.parejas_encontradas.includes(card) && card !==this.comprobar;
  }
}

function CargarPartida() {
  
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new Partida(cards);
 
          game.empezar_juego();
  cards.forEach(card => {
      card.addEventListener('click', () => {
          game.voltear_carta(card);
      });        
  });
  
}



setTimeout(() => {
  CargarPartida();
}, 500);