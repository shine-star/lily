import 'pixi.js';

// import MessageLayer from 'message_layer';
import LilyText from './lily_text';
import Letter from './letter';
import Util from './util';

class PixiRenderer {
  constructor(){
    // TODO: resolution option
    this.pixi = new PIXI.Application({width: 1920, height: 1080, resolution: 1/3});
    document.body.appendChild(this.pixi.view);
    this.sprites = {};
  }

  // 文字表示。アニメーション。ページ送り制御、etc....
  // TODO: 何の情報をEngineとRendererの間でやりとりする必要があるのか
  async showText(label, text){
    let textSprite = new LilyText(text, {fontFamily : 'Arial', fontSize: 80, fill : 0x333333, align : 'center'});

    const wait = async (time= 0) => {
      return new Promise(resolve => { setTimeout(resolve, time); });
    };

    const characters = String.prototype.split.call(text, '');
    let index = 0;
    let current = '';
    let x = 0;

    while (index < text.length) {
      await wait(50);

      current = characters[index];
      index++;
      let letter = new Letter(current, {fontFamily : 'Arial', fontSize: 80, fill : 0x333333, align : 'center'});
      letter.x = x;
      letter.y = 500;
      console.log(letter.width);
      x += letter.width;
      // TODO: フェードイン機構
      // await wait(50);
      this.pixi.stage.addChild(letter);
    }

  }

  async addImage(label, resource){
    let sprite = new PIXI.Sprite(resource.texture);
    this.sprites[label] = sprite;
    this.pixi.stage.addChild(sprite);
  }

  async _addImageWithOtherSprite(label, resource, guide, offset){
    let sprite = new PIXI.Sprite(resource.texture);

    const that = this.sprites[guide];
    if( that == undefined ){ throw new Error("Sprite named " + guide + " is not exists." ) }

    this.sprites[label] = sprite;
    const index = that.parent.children.indexOf(that);
    that.parent.addChildAt(sprite, index+offset);
  }

  async addImageUnder(label, resource, under){
    return this._addImageWithOtherSprite(label, resource, under, 0);
  }

  async addImageOver(label, resource, over){
    return this._addImageWithOtherSprite(label, resource, over, 1);
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
      await Util.animate(duration, (rate)=>{
        sprite.alpha = startAlpha + rate * (alpha - startAlpha);
      });
    }
    // TODO: else assertion
  }

  async move(label, left, top, duration){
    const sprite = this.sprites[label];
    if( sprite ) {
      const startX = sprite.x;
      const startY = sprite.y;
      const endX = left || sprite.x;
      const endY = top || sprite.y;

      await Util.animate(duration, (rate)=>{
        sprite.x = startX + rate * (endX - startX);
        sprite.y = startY + rate * (endY - startY);
      });
    }
  }

  async relabel(label, newlabel){
    const sprite = this.sprites[label];
    this.sprites[newlabel] = sprite;
    delete this.sprites[label];
  }

}

export default PixiRenderer;