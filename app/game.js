import 'pixi.js';

import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    // converted scripts:
    await timeout(1000);
    await this.engine.image("bg", "everett_effect");
    await timeout(1000);
    await this.engine.remove("bg");
  }
}

async function timeout(ms) {
  return new Promise(resolve => { setTimeout(resolve, ms); });
}

export default Game;