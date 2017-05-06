

class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
  }
  async wait({time= 0} = {}) {
    return new Promise(resolve => { setTimeout(resolve, time); });
  }

  async image({label, storage, opacity = 1.0} = {}){
    // TODO: pickup filename from manifest ?
    const resource = await this.loader.add(storage, storage+".jpg");
    await this.renderer.addImage(label, storage, resource);
    this.renderer.sprites[label].alpha = opacity;
  }
  async remove({label} = {}){
    await this.renderer.removeImage(label);
  }
  async fade({label, opacity = 1.0, duration = 0}){
    await this.renderer.fade(label, opacity, duration)
  }
}

export default Engine;