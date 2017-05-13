engine.defineTag('text', async ({label, text} = {}) => {
  // await engine.renderer.removeImage(label);
  await engine.renderer.showText(label, text);
});
