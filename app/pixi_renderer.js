import 'pixi.js';

import { animate } from './util';
import MessageLayer from './message_layer';

class PixiRenderer {
  constructor(width=1920, height=1080, resolution=1/3){
    this.width = width;
    this.height = height;
    this.pixi = new PIXI.Application({width: width, height: height, resolution: resolution});
    document.body.appendChild(this.pixi.view);
    this.sprites = {};
    this.configureEventTracking();
  }

  // ゲーム画面全域でのタップ/クリックイベント等を取り扱うためのレイヤを設定する
  configureEventTracking(){
    let layer = new PIXI.Graphics();
    layer.beginFill(0xf0000, 0.0);
    layer.drawRect(0, 0, this.width, this.height);
    layer.interactive = true;
    this.pixi.stage.addChild( layer );
    this.eventTrackerLayer = layer;
  }

  // 文字表示。アニメーション。ページ送り制御、etc....
  // TODO: 何の情報をEngineとRendererの間でやりとりする必要があるのか
  async showText(label, text){
    // TODO: メッセージレイヤは存在したら追加しなくて良いんじゃないのか？
    let layer = this.sprites[label];
    if( layer === undefined ){
      layer = new MessageLayer({maxWidth: 1800, maxHeight: 400});
      this.sprites[label] = layer;
      this.pixi.stage.addChild(layer);
      layer.y = 400;
    }

    await layer.add(text);
  }

  async linebreak(label){
    let layer = this.sprites[label];
    if( layer === undefined ){
      layer = new MessageLayer({maxWidth: 1800, maxHeight: 400});
      this.sprites[label] = layer;
      this.pixi.stage.addChild(layer);
      layer.y = 400;
    }
    await layer.linebreak();
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
      await animate(duration, (rate)=>{
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

      await animate(duration, (rate)=>{
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
  
  on(name, func){
    this.eventTrackerLayer.on(name, func);
  }

  once(name, func){
    this.eventTrackerLayer.once(name, func);
  }

  off(name, func){
    this.eventTrackerLayer.off(name, func);
  }

}

export default PixiRenderer;
