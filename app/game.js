import 'pixi.js';

import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    let context = {};
    // this束縛がアレだなー。 class内のときでもarrowにすればいいのか？
    context.wait = this.engine.wait.bind(this.engine);
    context.image = this.engine.image.bind(this.engine);
    context.remove = this.engine.remove.bind(this.engine);
    context.fade = this.engine.fade.bind(this.engine);

    Script.call(context);
  }
}

export default Game;