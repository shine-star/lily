import 'pixi.js';

import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    await this.engine.bgimage("everett_effect");
  }
}

export default Game;