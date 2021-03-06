// requestAnimationFrame wrapper, callbackは開始時からのdurationをミリ秒で受け取り、終わるとPromiseがresolveされます
// TODO: ユーザーの操作によって戻せるようにする
export async function animate(duration, callback){
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

// time ms だけ待つ async
export async function wait(time= 0){
  return new Promise(resolve => { setTimeout(resolve, time); });
}
