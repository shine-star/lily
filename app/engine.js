
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
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(filename);
    const raw = await response.text();
    const transformedJS = Babel.transform(raw, { presets: ['es2017'] }).code;
    const asyncGameFunc = new Function("resolve", "tags", transformedJS);
    this.runScriptFunc((tags)=>{
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

    this.tags.image = async ({label, storage, opacity = 1.0} = {}) => {
      // TODO: pickup filename from manifest ?
      const resource = await this.loader.add(storage, "data/image/"+storage+".jpg");
      await this.renderer.addImage(label, storage, resource);
      this.renderer.sprites[label].alpha = opacity;
    };

    this.tags.remove = async ({label} = {}) => {
      await this.renderer.removeImage(label);
    };

    this.tags.fade = async ({label, opacity = 1.0, duration = 0}) => {
      await this.renderer.fade(label, opacity, duration)
    };


  }



}

export default Engine;