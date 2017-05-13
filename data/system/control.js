engine.defineTag('wait', async ({time= 0} = {}) => {
  return new Promise(resolve => { setTimeout(resolve, time); });
});

engine.defineTag('call', async ({storage="", target=""} = {} ) => {
  if(target){
    throw new Error("label jump (target argument) is not implemented yet.");
  }

  await engine.runScript(storage);
});

engine.defineTag('label', async ({name=""} = {} ) => {
  // TODO: label title?
});
