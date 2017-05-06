import Game from './game';
import PixiRenderer from './pixi_renderer'
import PixiLoader from './pixi_loader';

let loader = new PixiLoader();
let renderer = new PixiRenderer();
let game = new Game(renderer, loader);

(async () => {
  "use strict";
  await game.start();
  console.log("ended.");
})();
