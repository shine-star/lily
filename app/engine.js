
import * as Babel from 'babel-standalone';

import 'whatwg-fetch';

//TODO: Engineにマクロを外部から足す方法を提供すること！ DIっぽい感じで。
class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
    this.tags = {};

    this.define_standard_tags();
  }

  async runScript(filename){
    const path = "data/scenario/" + filename;
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(path);
    const raw = await response.text();
    const transformedJS = Babel.transform(raw, { presets: ['es2017'] }).code;
    const asyncGameFunc = new Function("resolve", "tags", transformedJS);
    await this.runScriptFunc((tags)=>{
      return new Promise(resolve => { asyncGameFunc(resolve, tags); });
    });
  }

  async runScriptFunc(script){
    await script(this.tags);
  }

  //TODO: 外部からマクロ的にタグ定義する方法を考えてないので暫定的。
  // 標準タグをマクロ的に再定義できて良いものかは、ちょっと迷いますね。
  define_standard_tags(){
    this.tags.wait = async ({time= 0} = {}) => {
      return new Promise(resolve => { setTimeout(resolve, time); });
    };

    this.tags.image = async ({label, storage, opacity = 1.0, left=0, top=0, scale=1.0, under="", over=""} = {}) => {
      // TODO: pickup filename from manifest ?
      const resource = await this.loader.addImage(storage);
      if( over.length > 0 ){
        await this.renderer.addImageOver(label, resource, over);
      }else if( under.length > 0 ){
        await this.renderer.addImageUnder(label, resource, under);
      }else{
        await this.renderer.addImage(label, resource);
      }
      const sprite = this.renderer.sprites[label];
      sprite.alpha = opacity;
      sprite.x = left;
      sprite.y = top;
      sprite.scale.set(scale, scale);
    };

    this.tags.remove = async ({label} = {}) => {
      await this.renderer.removeImage(label);
    };

    this.tags.fade = async ({label, opacity = 1.0, time = 0}) => {
      await this.renderer.fade(label, opacity, time)
    };

    this.tags.move = async ({label, left = undefined, top = undefined, time = 0}) => {
      await this.renderer.move(label, left, top, time);
    };

    this.tags.relabel = async ({label, newlabel}) => {
      await this.renderer.relabel(label, newlabel);
    };

    this.tags.call = async ({storage="", target=""} = {} ) => {
      if(target){
        throw new Error("label jump (target argument) is not implemented yet.");
      }

      this.runScript(storage);
    };

    this.tags.macro = (name, func) => {
      this.tags[name] = func;
    }
  }



}

export default Engine;