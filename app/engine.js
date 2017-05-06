async function timeout(ms) {
  return new Promise(resolve => { setTimeout(resolve, ms); });
}


class Engine {
  // TODO: constructor should get renderer
  constructor(renderer, loader){
    this.renderer = renderer;
    this.loader = loader;
  }
  async bgimage(filename){
    //TODO: pickup filename from manifest ?
    const resource = await this.loader.add(filename, filename+".jpg");
    await timeout(3000);
    await this.renderer.drawBGImage(filename, resource);
    await timeout(3000);
    await this.renderer.removeBGImage();
  }
}

export default Engine;