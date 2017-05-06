import 'pixi.js';

class PixiRenderer {
  constructor(){
    // TODO: resolution option
    let pixi = new PIXI.Application({width: 1920, height: 1080, resolution: 1/2});
    document.body.appendChild(pixi.view);
    this.pixi = pixi;
  }
  async drawBGImage(filename, resource){
    let resources = resource.resources;
    var sprite = new PIXI.Sprite(resources[filename].texture);
    this.pixi.stage.addChild(sprite);
    this.bg = sprite;

    // TODO: texture image size based scaling?

    // ee.x = this.pixi.renderer.width / 2;
    // ee.y = this.pixi.renderer.height / 2;
    // ee.anchor.x = 0.5;
    // ee.anchor.y = 0.5;
  }
  async removeBGImage(){
    // how to remove bg sprite?
    this.pixi.stage.removeChild(this.bg);
  }
}

export default PixiRenderer;