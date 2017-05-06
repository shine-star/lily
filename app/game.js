import 'pixi.js';

import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    // converted scripts:
    await wait(1000);
    await this.engine.image("bg", "everett_effect", {alpha: 0.1});
    await this.engine.fade("bg", {alpha: 1.0, duration: 2000});
    // await this
    await wait(1000);
    await this.engine.fade("bg", {alpha: 0.0, duration: 2000});
    await this.engine.remove("bg");
  }
}

async function wait(ms) {
  return new Promise(resolve => { setTimeout(resolve, ms); });
}

export default Game;