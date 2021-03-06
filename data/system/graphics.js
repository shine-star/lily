engine.defineTag('image', async ({label, storage, opacity = 1.0, left=0, top=0, scale=1.0, under="", over=""} = {}) => {
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
});

engine.defineTag('remove', async ({label} = {}) => {
  await engine.renderer.removeImage(label);
});

engine.defineTag('fade', async ({label, opacity = 1.0, time = 0}) => {
  await engine.renderer.fade(label, opacity, time)
});

engine.defineTag('move', async ({label, left = undefined, top = undefined, time = 0}) => {
  await engine.renderer.move(label, left, top, time);
});

engine.defineTag('relabel', async ({label, newlabel}) => {
  await engine.renderer.relabel(label, newlabel);
});


//TODO: マクロとして定義できるようにしてあげたい
engine.defineTag("fadein", async ({label, storage, left=0.0, top=0.0, scale=1.0, time=500} = {})=>{
  await engine.tags.image({label: label, storage: storage, opacity: 0.0, left: left, top: top, scale: scale});
  await engine.tags.fade({label: label, opacity: 1.0, time: time});
});

engine.defineTag("fadeout", async ({label, time=500} = {})=>{
  await engine.tags.fade({label: label, opacity: 0.0, time: time});
  await engine.tags.remove({label: label});
});