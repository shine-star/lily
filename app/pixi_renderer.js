import 'pixi.js';

class PixiRenderer {
  constructor(){
    // TODO: resolution option
    this.pixi = new PIXI.Application({width: 1920, height: 1080, resolution: 1/3});
    document.body.appendChild(this.pixi.view);
    this.sprites = {};
  }

  async addImage(label, resource){
    let sprite = new PIXI.Sprite(resource.texture);
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
    const sprite = this.sprites[label];
    if( sprite ) {
      const startAlpha = sprite.alpha;
      await animate(duration, (rate)=>{
        sprite.alpha = startAlpha + rate * (alpha - startAlpha);
      });
    }
    // TODO: else assertion
  }
}

// requestAnimationFrame wrapper, callbackは開始時からのdurationをミリ秒で受け取り、終わるとPromiseがresolveされます
async function animate(duration, callback){
  "use strict";
  return new Promise(resolve => {
    if(!(duration > 0)){
      callback(1.0);
      resolve();
      return;
    }
    const start = Date.now();
    const f = ()=> {
      const current = Date.now();
      const delta = current - start;
      if( delta > duration ){
        callback(1.0);
        resolve();
        return;
      }
      callback(delta / duration);

      window.requestAnimationFrame(f);
    };
    f(start);
  }
  );
}

export default PixiRenderer;