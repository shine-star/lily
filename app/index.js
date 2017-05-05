import Game from './game';
import Renderer from './renderer'

async function timeout(ms) {
  return new Promise(resolve => { setTimeout(resolve, ms); });
}

let renderer = new Renderer();
let game = new Game(renderer);

(async () => {
  "use strict";
  await game.start();
  console.log("ended.");
})();

//engine.start();