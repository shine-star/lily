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
    // TODO: else assertion
  }

  async fade(label, alpha, duration){
    return new Promise(resolve => {
      const sprite = this.sprites[label];
      if( sprite ){
        const startAlpha = sprite.alpha;
        const start = Date.now();
        const f = ()=> {
          const current = Date.now();
          const d = current - start;
          if( d > duration ){
            resolve();
            return;
          }
          const newAlpha = startAlpha +  d * ((alpha - startAlpha)/duration);
          // console.log("newAlpha: " + newAlpha);
          sprite.alpha = newAlpha;

          window.requestAnimationFrame(f);
        };
        f(start);
      }
    });
    // TODO: else assertion
  }

}

export default PixiRenderer;