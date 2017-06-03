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
    // TODO: ここのpixiIdを無理に設定してキャッシュヒットを防いでいるけれど、無理があるので後で直すべき。
    canvas._pixiId = Math.random() * 10000 + "-desu";

    const texture = PIXI.Texture.fromCanvas(canvas, PIXI.settings.SCALE_MODE, 'text');

    texture.orig = new PIXI.Rectangle();
    texture.trim = new PIXI.Rectangle();

    super(texture);

    // base texture is already automatically added to the cache, now adding the actual texture
    // PIXI.Texture.addToCache(this._texture, this._texture.baseTexture.textureCacheIds[0]);

    this.canvas = canvas;

    this.context = this.canvas.getContext('2d');

    // TODO: renderWebGLからresolution取得しないと辻褄合わない事に気づいた。。
    // this.resolution = PIXI.settings.RESOLUTION;
    this.resolution = 1/3;

    // drawText.
    style = new PIXI.TextStyle(style);
    this._font = style.toFontString();

    const measured = PIXI.TextMetrics.measureText(text, style, style.wordWrap, this.canvas);
    const width = measured.width;
    const height = measured.height;
    const lines = measured.lines;
    const lineHeight = measured.lineHeight;
    const lineWidths = measured.lineWidths;
    const maxLineWidth = measured.maxLineWidth;
    const fontProperties = measured.fontProperties;


    // this.canvas.width = 120;
    // this.canvas.height = 120;

    this.canvas.width = Math.ceil((width + (style.padding * 2)) * this.resolution);
    this.canvas.height = Math.ceil((height + (style.padding * 2)) * this.resolution);
    this._width = width + (style.padding * 2);
    this._height = height + (style.padding * 2);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //debugger;
    this.context.scale(this.resolution, this.resolution);
    this.context.font = this._font;
    this.context.fillStyle = style.fill;
    //this.context.miterLimit = style.miterLimit;
    this.context.shadowBlur = 0;
    this.context.globalAlpha = 1;


    // draw lines line by line
    const linePositionX = style.strokeThickness / 2;
    const linePositionY = style.strokeThickness / 2 + fontProperties.ascent;

    this.context.fillText(text, linePositionX, linePositionY);

    // update texture.
    texture.baseTexture.hasLoaded = true;
    texture.baseTexture.resolution = this.resolution;

    texture.baseTexture.realWidth = this.canvas.width;
    texture.baseTexture.realHeight = this.canvas.height;
    texture.baseTexture.width = this.canvas.width / this.resolution;
    texture.baseTexture.height = this.canvas.height / this.resolution;

    texture.trim.width = this.canvas.width / this.resolution;
    texture.trim.height = this.canvas.height / this.resolution;

    const padding = style.padding;
    texture.orig.width = texture._frame.width - (padding * 2);
    texture.orig.height = texture._frame.height - (padding * 2);

    this._texture = texture;
  }

  get width(){
    return this._width;
  }

  get height(){
    return this._height;
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