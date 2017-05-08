import 'pixi.js';

import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    await this.engine.run();
  }

}

export default Game;