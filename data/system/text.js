engine.defineTag('text', async ({label, text} = {}) => {
  // await engine.renderer.removeImage(label);
  await engine.renderer.showText(label, text);
});

engine.defineTag('r', async ({label} = {}) => {
  // await engine.renderer.removeImage(label);
  await engine.renderer.linebreak(label);
});
