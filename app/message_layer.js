import 'pixi.js';

import { wait } from './util';
import Letter from './letter';

export default class MessageLayer extends PIXI.Container {
  constructor({maxWidth=800, maxHeight=400} = {})
  {
    super();

    const textContainer = new PIXI.Container();
    this.addChild(textContainer);
    this.textContainer = textContainer;

    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;

    this.letterX = 0;
    this.letterY = 0;
  }

  // 文字列を追加, 勝手に表示されます
  async add(text)
  {
    const characters = String.prototype.split.call(text, '');
    const lineHeight = 100;
    let index = 0;

    while (index < text.length) {
      // 簡易的な改行処理
      if( this.letterX > this.maxWidth ){
        this.letterX = 0;
        this.letterY += lineHeight;
      }
      if( this.letterY > this.maxHeight ){
        //TODO: クリック待ち？
        await this.clear();
      }
      const char = characters[index];
      index++;
      let letter = new Letter(char, {fontFamily : 'Arial', fontSize: 80, fill : 0x333333, align : 'center'});
      this.textContainer.addChild(letter);
      letter.x = this.letterX;
      letter.y = this.letterY;

      this.letterX += letter.width;
      await wait(30);

    }
  }

  // クリア
  async clear()
  {
    this.letterX = 0;
    this.letterY = 0;
    this.textContainer.removeChildren();
  }
}