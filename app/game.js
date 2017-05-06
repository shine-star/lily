import 'pixi.js';

import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    // [wait time=1000]
    await this.engine.wait({time: 1000});
    // [image label="bg" storage="everett_effect" opacity=0.1]
    await this.engine.image({label: "bg", storage:"everett_effect", opacity: 0.1});
    // [fade label="bg" opacity=0.1 duration=2000]
    await this.engine.fade({label: "bg", opacity: 1.0, duration: 2000});
    // [wait time=1000]
    await this.engine.wait({time: 1000});
    // [fade label="bg" opacity=0.0 duration=2000]
    await this.engine.fade({label: "bg", opacity: 0.0, duration: 2000});
    // [fade label="bg"]
    await this.engine.remove({label: "bg"});
  }
}

export default Game;