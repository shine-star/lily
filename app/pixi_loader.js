import 'pixi.js';

class PixiLoader {
  constructor(){
    this.loader = PIXI.loader;
  }

  async add(name, path){
    return new Promise(resolve => {
      if( PIXI.loader.resources[name] ){
        resolve(PIXI.loader.resources[name]);
        return;
      }
      this.loader.add(name, path).load((loader, resources)=>{
        resolve(resources[name]);
      });
    });
  }

  async addImage(filename){
    const name = "image/"+filename;
    return this.add(name, "data/"+name);
  }

}

export default PixiLoader;