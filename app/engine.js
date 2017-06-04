
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
    const requestHead = { headers: new Headers({ 'pragma': 'no-cache', 'cache-control': 'no-cache'}) };
    const request = new Request(path);
    const response = await fetch(request, requestHead);
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

  // ゲーム画面全体へのpointerup等の操作を一回だけ受け付ける
  once(name, func){
    this.renderer.once(name, func);
  }

  // ゲーム画面全体へのpointerup等の操作を複数回受け付ける
  on(name, func){
    this.renderer.on(name, func);
  }

  // ゲーム画面全体へのpointerup等の操作を受け付けるのをやめる
  off(name, func){
    this.renderer.off(name, func);
  }

  noise(){
    let filter = new NoiseFilter();
    this.renderer.pixi.stage.filters = [filter];
  }

  glitch(){
    let filter = new GlitchFilter();
    this.renderer.pixi.stage.filters = [filter];
    this.renderer.pixi.ticker.add((delta)=>{
      filter.uniforms.t += delta * 0.01;
    });
  }

  sepia(){
    let filter = new SepiaFilter();
    this.renderer.pixi.stage.filters = [filter];
  }

  stopFilter(){
    this.renderer.pixi.stage.filters = [];
  }

}

class NoiseFilter extends PIXI.Filter {
  constructor() {
    var fragment = `
precision mediump float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main (void)
{
   vec4 col = texture2D(uSampler, vTextureCoord);
   col.rgb = col.rgb * (0.7 + 0.3 * rand(vTextureCoord) );
   gl_FragColor.rgba = col.rgba;
}
    `;

    super(
      // vertex shader
      null,
      // fragment shader
      fragment,
      // uniforms
      {
        dimensions: {type: '4fv', value: [0, 0, 0, 0]},
      }
    );
  }
}



class GlitchFilter extends PIXI.Filter {
  constructor() {
    var fragment = `
precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 filterClamp;
uniform float t;

#define M_PI 3.1415926535897932384626433832795

void main(void)
{
  vec2 pos = vTextureCoord.xy / filterClamp.zw;
  vec2 target = pos;
  
  float doornot = step(0.8, sin(t * 10.0));
  
  float offsetSign = sign( sin(pos.y * M_PI * 40.0) ) * doornot;
  if( abs(offsetSign) > 0.0 ){
    target.x = clamp(target.x + (offsetSign * 0.05), 0.01, 0.99);
  }
  
  gl_FragColor = texture2D(uSampler, target * filterClamp.zw); 
}
    `;

    super(
      // vertex shader
      null,
      // fragment shader
      fragment,
      {
        t: {type: '1f', value: 0.0},
      }
    );
  }
}

class SepiaFilter extends PIXI.Filter {
  constructor() {
    var fragment = `
precision mediump float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main(void)
{
   vec4 color = texture2D(uSampler, vTextureCoord);
   vec4 col = color;
   col.r = clamp(color.r * 0.393 + color.g * 0.769 + color.b * 0.189, 0.0, 1.0);
   col.g = clamp(color.r * 0.349 + color.g * 0.686 + color.b * 0.168, 0.0, 1.0);
   col.b = clamp(color.r * 0.272 + color.g * 0.534 + color.b * 0.131, 0.0, 1.0);
   // col.rgb = col.rgb * (0.7 + 0.3 * rand(vTextureCoord) );
   gl_FragColor.rgba = col.rgba;
}
    `;

    super(
      // vertex shader
      null,
      // fragment shader
      fragment,
      // uniforms
      {
        dimensions: {type: '4fv', value: [0, 0, 0, 0]},
      }
    );
  }
}

export default Engine;
