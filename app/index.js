// import 'babel-polyfill';

async function timeout(ms) {
  return new Promise(resolve => { setTimeout(resolve, ms); });
}

(async () => {
  "use strict";
  for( let i=0; i<10; i++ ){
    await timeout(1000);
    document.write("A");
  }
})();