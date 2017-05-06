import 'pixi.js';

class PixiRenderer {
  constructor(){
    // TODO: resolution option
    this.pixi = new PIXI.Application({width: 1920, height: 1080, resolution: 1/3});
    document.body.appendChild(this.pixi.view);
    this.sprites = {};
  }

  async addImage(label, filename, resource){
    let resources = resource.resources;
    let sprite = new PIXI.Sprite(resources[filename].texture);
    this.sprites[label] = sprite;
    this.pixi.stage.addChild(sprite);
  }

  async removeImage(label){
    if( this.sprites[label] ){
      this.pixi.stage.removeChild(this.sprites[label]);
      delete this.sprites[label];
    }
  }

}

export default PixiRenderer;