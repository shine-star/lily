engine.tags.image = async ({label, storage, opacity = 1.0, left=0, top=0, scale=1.0, under="", over=""} = {}) => {
  // TODO: pickup filename from manifest ?
  const resource = await engine.loader.addImage(storage);
  if( over.length > 0 ){
    await engine.renderer.addImageOver(label, resource, over);
  }else if( under.length > 0 ){
    await engine.renderer.addImageUnder(label, resource, under);
  }else{
    await engine.renderer.addImage(label, resource);
  }
  const sprite = engine.renderer.sprites[label];
  sprite.alpha = opacity;
  sprite.x = left;
  sprite.y = top;
  sprite.scale.set(scale, scale);
};

engine.tags.remove = async ({label} = {}) => {
  await engine.renderer.removeImage(label);
};

engine.tags.fade = async ({label, opacity = 1.0, time = 0}) => {
  await engine.renderer.fade(label, opacity, time)
};

engine.tags.move = async ({label, left = undefined, top = undefined, time = 0}) => {
  await engine.renderer.move(label, left, top, time);
};

engine.tags.relabel = async ({label, newlabel}) => {
  await engine.renderer.relabel(label, newlabel);
};