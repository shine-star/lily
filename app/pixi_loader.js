import 'pixi.js';

class PixiLoader {
  constructor(){
    this.loader = PIXI.loader;
  }

  async add(name, path){
    return new Promise(resolve => {
      this.loader.add(name, path).load((loader, resources)=>{
        resolve({loader: loader, resources: resources});
      });
    });
  }
}

export default PixiLoader;