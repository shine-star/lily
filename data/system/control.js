engine.defineTag('wait', async ({time= 0} = {}) => {
  return new Promise(resolve => { setTimeout(resolve, time); });
});

engine.defineTag('call', async ({storage="", target=""} = {} ) => {
  if(target){
    throw new Error("label jump (target argument) is not implemented yet.");
  }

  await engine.runScript(storage);
});

engine.defineTag('label', async ({name} = {} ) => {
  // TODO: label title?
});

engine.defineTag('eval', async (exp) => {
  //TODO: f, tf の処理方法
  var sf = engine.variables.sf;
  var f = engine.variables.f;
  var tf = engine.variables.tf;

  // 多分Reflection使えばexpの引数名が調べれるので、それを使ってfとかtfとかを必要な場合にのみ渡すって方向もアリ。
  // クロージャの名前空間がどこまで引っ張られるかイマイチ分かってないので、引数で本当に渡す必要があるのかちょっと不明...

  exp(sf, f, tf);
});

engine.defineTag('if', async (exp) => {
  var sf = engine.variables.sf;
  var f = engine.variables.f;
  var tf = engine.variables.tf;

  engine.skipUntilElseOrEndIf = ! exp(sf, f, tf);
});

engine.defineTag('else', async () => {
  if( engine.skipUntilElseOrEndIf ){
    // すぐ手前のifで飛ばされてたって事なので、フラグ降ろして以下は実行する
    engine.skipUntilElseOrEndIf = false;
  }else{
    // すぐ手前のelseで飛ばされてないって事なので、以下は実行しない。
    engine.skipUntilEndIf = true;
  }
});

engine.defineTag('endif', async() => {
  if( engine.skipUntilEndIf ){
    engine.skipUntilEndIf = false;
  }
  if( engine.skipUntilElseOrEndIf ){
    engine.skipUntilElseOrEndIf = false;
  }
});
