import 'pixi.js';

import { wait } from './util';
import Letter from './letter';

export default class MessageLayer extends PIXI.Container {
  constructor()
  {
    super();
  }

  // 文字列を追加, 勝手に表示されます
  async add(text)
  {
    const characters = String.prototype.split.call(text, '');
    let index = 0;
    let current = '';
    let x = 0;

    while (index < text.length) {
      await wait(50);

      current = characters[index];
      index++;
      let letter = new Letter(current, {fontFamily : 'Arial', fontSize: 80, fill : 0x333333, align : 'center'});
      letter.x = x;
      letter.y = 0;
      console.log(letter.width);
      x += letter.width;
      // TODO: フェードイン機構
      // await wait(50);
      this.addChild(letter);
    }
  }

  // クリア
  async clear()
  {

  }
}