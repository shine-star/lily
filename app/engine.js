

class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
  }
  async image(label, filename, options = {}){
    // TODO: pickup filename from manifest ?
    const resource = await this.loader.add(filename, filename+".jpg");
    await this.renderer.addImage(label, filename, resource);
    if( options.alpha ){
      this.renderer.sprites[label].alpha = options.alpha;
    }
  }
  async remove(label){
    await this.renderer.removeImage(label);
  }
  async fade(label, options = {}){
    // console.log("[Label] alpha: " + options.alpha + ", duration: " + options.duration);
    await this.renderer.fade(label, options.alpha, options.duration)
  }
}

export default Engine;