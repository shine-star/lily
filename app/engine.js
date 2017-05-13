
import * as Babel from 'babel-standalone';

import 'whatwg-fetch';

//TODO: Engineにマクロを外部から足す方法を提供すること！ DIっぽい感じで。
class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
    this.tags = {};

    this.skipUntilLabel = '';
    this.skipUntilCursor = 0;

    //TODO: ちゃんとしたコールスタックの実装で多重if-elseへの対応
    this.skipUntilElseOrEndIf = false;
    this.skipUntilEndIf = false;

    this.variables = {
      tf: {},
      f: {},
      sf: {}
    };
  }

  async run(){
    await this.evaluateSystemAsync('data/system/init.js');
    await this.runScript("first.js");
  }

  //TODO: loadは引数を受け取るべきだとか色々問題はあるが、今やるべきなのはコードの途中から実行する機能
  async load(){
    await this.evaluateSystemAsync('data/system/init.js');

    // debugラベルまでスキップするってこと
    this.skipUntilLabel = 'debug';
    // debugの後4つめのタグから実行するってこと
    this.skipUntilCursor = 0;

    // TODO: コールスタックの保持
    await this.runScript("first.js");
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

  async evaluateSystemAsync(path){
    //TODO: あらゆる観点でのエラー処理, 単にfetchを呼ぶのではなくオプションを正しく指定したwrapperを用意したい（redirectをフォローすべきでない、等があるので。）
    const response = await fetch(path);
    const raw = await response.text();
    const asyncGameFunc = new Function("resolve", "engine", this.transform(raw));
    await ((engine)=>{
      return new Promise(resolve => { asyncGameFunc(resolve, engine); });
    })(this);
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

  async runScript(filename, target){
    const path = "data/scenario/" + filename;
    if( target ){
      this.skipUntilLabel = target;
    }
    await this.evaluateScript(path);
  }

  async loadSystem(filename){
    const path = "data/system/" + filename;
    await this.evaluateSystem(path);
  }

  defineTag(name, func){
    this.tags[name] = async (options)=> {
      // jump/call及びセーブデータのロード系
      if( this.skipUntilLabel.length > 0 ){
        // TODO: もっとOOPらしい書き方にしたいけど暫定的に。
        if( name == 'label' && this.skipUntilLabel == options.name ){
          this.skipUntilLabel = '';
        }
        return;
      }
      if( this.skipUntilCursor > 0 ){
        this.skipUntilCursor -= 1;
        return;
      }
      // if-else系 (きちんとコールスタックを作らない暫定版)
      if( this.skipUntilElseOrEndIf ){
        if( name == 'else' || name == 'endif' ){
          this.skipUntilElseOrEndIf = false;
        }
        return;
      }
      if( this.skipUntilEndIf ) {
        if( name == 'endif' ){
          this.skipUntilEndIf = false;
        }
        return;
      }

      await func(options);
    };
  }

}

export default Engine;