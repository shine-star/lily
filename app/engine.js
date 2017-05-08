
import * as Babel from 'babel-standalone';

import 'whatwg-fetch';

//TODO: Engineにマクロを外部から足す方法を提供すること！ DIっぽい感じで。
class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
    this.tags = {};
  }

  async run(){
    await this.loadSystem('init.js');
  }

  async evaluateScript(path){
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(path);
    const raw = await response.text();
    const asyncGameFunc = new Function("resolve", "tags", this.transform(raw));
    await ((tags)=>{
      return new Promise(resolve => { asyncGameFunc(resolve, tags); });
    })(this.tags);
  }

  async evaluateSystem(path){
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(path);
    const raw = await response.text();
    const gameFunc = new Function("engine", this.transform(raw));
    gameFunc(this);
  }

  transform(script){
    return Babel.transform(script, { presets: ['es2017'] }).code
  }

  async runScript(filename){
    const path = "data/scenario/" + filename;
    await this.evaluateScript(path);
  }

  async loadSystem(filename){
    const path = "data/system/" + filename;
    await this.evaluateSystem(path);
  }

}

export default Engine;