import Script from './script';
import Engine from './engine';
import 'pixi.js';

class Game {
  constructor(renderer){
    this.renderer = renderer;
    this.engine = new Engine(this.renderer);
  }
  async start(){
    //await this.engine.bgimage("start");
    await this.mypixi();
    //let context = {};
    // context.bgimage = engine.bgimage;
    //Script.call(context);
  }
  async mypixi(){
    var app = new PIXI.Application();
    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    document.body.appendChild(app.view);
    // load the texture we need
    PIXI.loader.add('everett_effect', 'everett_effect.jpg').load(function(loader, resources) {

      // This creates a texture from a 'bunny.png' image.
      var ee = new PIXI.Sprite(resources.everett_effect.texture);

      // Setup the position of the bunny
      ee.x = app.renderer.width / 2;
      ee.y = app.renderer.height / 2;

      // Rotate around the center
      ee.anchor.x = 0.5;
      ee.anchor.y = 0.5;

      // Add the bunny to the scene we are building.
      app.stage.addChild(ee);

      // Listen for frame updates
      app.ticker.add(function() {
        // each frame we spin the bunny around a bit
        ee.rotation += 0.01;
      });
    });
  }
}

export default Game;