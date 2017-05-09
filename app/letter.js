import 'pixi.js';

// 1文字
export default class Letter extends PIXI.Sprite {
  // 文字サイズとか諸々は後で考える！
  // TOOD: なるべくcanvasは外から与えてあげよう
  constructor(char, style, canvas)
  {
    if(char.length !== 1){
      throw new Error("Letter char must be 1 length string.");
    }
    const text = char;
    canvas = canvas || document.createElement('canvas');

    const texture = PIXI.Texture.fromCanvas(canvas, PIXI.settings.SCALE_MODE, 'text');

    texture.orig = new PIXI.Rectangle();
    texture.trim = new PIXI.Rectangle();

    super(texture);

    // base texture is already automatically added to the cache, now adding the actual texture
    // PIXI.Texture.addToCache(this._texture, this._texture.baseTexture.textureCacheIds[0]);

    this.canvas = canvas;

    this.context = this.canvas.getContext('2d');

    this.resolution = PIXI.settings.RESOLUTION;

    // drawText.
    this._font = (new PIXI.TextStyle(style)).toFontString();

    this.canvas.width = 1920;
    this.canvas.height = 300;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.scale(1, 1);
    this.context.font = this._font;
    this.context.fillStyle = "black";

    // draw lines line by line
    this.context.fillText(text, 30, 80);

    // update texture.
    texture.baseTexture.hasLoaded = true;
    texture.baseTexture.resolution = this.resolution;

    texture.trim.width = this.canvas.width / this.resolution;
    texture.trim.height = this.canvas.height / this.resolution;
  }

  destroy(options)
  {
    if (typeof options === 'boolean')
    {
      options = { children: options };
    }

    options = Object.assign({}, defaultDestroyOptions, options);

    super.destroy(options);

    // make sure to reset the the context and canvas.. dont want this hanging around in memory!
    this.context = null;
    this.canvas = null;

    this._style = null;
  }
}