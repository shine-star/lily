import 'pixi.js';

import Engine from './engine';

import * as Babel from 'babel-standalone';

import 'whatwg-fetch';

class Game {
  constructor(renderer, loader){
    this.engine = new Engine(renderer, loader);
  }
  async start(){
    await this.runScript('script.js');
  }

  async runScript(filename){
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(filename);
    const raw = await response.text();
    const transformedJS = Babel.transform(raw, { presets: ['es2017'] }).code;
    const asyncGameFunc = new Function("resolve", "tags", transformedJS);
    this.runWithTags((tags)=>{
      return new Promise(resolve => { asyncGameFunc(resolve, tags); });
    });
  }

  async runWithTags(script){
    await script(this.engine.tags);
  }
}

export default Game;