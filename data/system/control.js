engine.tags.wait = async ({time= 0} = {}) => {
  return new Promise(resolve => { setTimeout(resolve, time); });
};

engine.tags.call = async ({storage="", target=""} = {} ) => {
  if(target){
    throw new Error("label jump (target argument) is not implemented yet.");
  }

  engine.runScript(storage);
};

engine.tags.macro = (name, func) => {
  engine.tags[name] = func;
};
