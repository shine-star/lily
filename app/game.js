import Script from './script';
import Engine from './engine';

class Game {
  constructor(renderer){
    this.renderer = renderer;
    this.engine = new Engine(this.renderer);
  }
  async start(){
    await this.engine.bgimage("start");
    //let context = {};
    // context.bgimage = engine.bgimage;
    //Script.call(context);
  }
}

export default Game;