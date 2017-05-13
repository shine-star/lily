engine.defineTag('wait', async ({time= 0} = {}) => {
  return new Promise(resolve => { setTimeout(resolve, time); });
});

engine.defineTag('tags', async ({storage="", target=""} = {} ) => {
  if(target){
    throw new Error("label jump (target argument) is not implemented yet.");
  }

  engine.runScript(storage);
});

engine.defineTag('label', async ({name=""} = {} ) => {
  // TODO: label title?
});
