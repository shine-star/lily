

class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
  }
  async image(label, filename){
    // TODO: pickup filename from manifest ?
    const resource = await this.loader.add(filename, filename+".jpg");
    await this.renderer.addImage(label, filename, resource);
  }
  async remove(label){
    await this.renderer.removeImage(label);
  }
}

export default Engine;