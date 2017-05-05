class Engine {
  // TODO: constructor should get renderer
  constructor(renderer){
    this.renderer = renderer;
  }
  async bgimage(filename){
    alert(this.renderer.greet(filename));
    // this.renderer.pixi.render
  }
}

export default Engine;