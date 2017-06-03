// TODO: とりあえずベタ書きしたけど、責任範囲は要検討。engine経由でどこまで何を露出するか、等が難しい。
engine.defineTag('sakura', async ({count} = {} ) => {
  const resource = await engine.loader.addImage('sakura.png');

  const sprites = new PIXI.particles.ParticleContainer(count, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true
  });
  engine.renderer.pixi.stage.addChild(sprites);
  engine.renderer.sprites['sakura'] = sprites;

  let petals = [];
  for (let i = 0; i < count; i++) {
    const petal = new PIXI.Sprite(resource.texture);

    // petal.tint = Math.random() * 0xE8D4CD;

    // set the anchor point so the texture is centerd on the sprite
    petal.anchor.set(0.5);

    // different petals, different sizes
    petal.scale.set(0.5 + Math.random() * 0.2);

    // scatter them all
    petal.x = Math.random() * engine.renderer.width;
    petal.y = Math.random() * engine.renderer.height;

    // petal.tint = Math.random() * 0x808080;

    // create a random direction in radians
    // dude.direction = Math.random() * Math.PI * 2;

    // this number will be used to modify the direction of the sprite over time
    // dude.turningSpeed = Math.random() - 0.8;

    // create a random speed between 0 - 2, and these maggots are slooww
    petal.yspeed = (2 + Math.random() * 2);
    petal.xspeed = (4 - Math.random() * 2);

    // dude.offset = Math.random() * 100;

    // finally we push the dude into the maggots array so it it can be easily accessed later
    petals.push(petal);
    sprites.addChild(petal);
  }

  engine.renderer.pixi.ticker.add( ()=> {

    // iterate through the sprites and update their position
    for (let i = 0; i < count; i++) {
      const petal = petals[i];

      // petal.x += petal.speed;
      petal.y += petal.yspeed;
      petal.x += petal.xspeed;

      if( petal.y > engine.renderer.height ){
        petal.y = 0;
      }

      if( petal.x > engine.renderer.width ){
        petal.x = 0;
      }

      if( petal.x < 0 ){
        petal.x = engine.renderer.width;
      }

      // dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
      // dude.direction += dude.turningSpeed * 0.01;
      // dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
      // dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
      // dude.rotation = -dude.direction + Math.PI;
      //
      // // wrap the maggots
      // if (dude.x < dudeBounds.x) {
      //   dude.x += dudeBounds.width;
      // }
      // else if (dude.x > dudeBounds.x + dudeBounds.width) {
      //   dude.x -= dudeBounds.width;
      // }
      //
      // if (dude.y < dudeBounds.y) {
      //   dude.y += dudeBounds.height;
      // }
      // else if (dude.y > dudeBounds.y + dudeBounds.height) {
      //   dude.y -= dudeBounds.height;
      // }
    }

    // increment the ticker
    // tick += 0.1;
  });


});

engine.defineTag('stopsakura', async () => {
  engine.tags.fadeout({label: 'sakura'});
  //TODO: tickの削除
});


engine.defineTag('glitch', async ()=> {
  engine.glitch();
});

engine.defineTag('stopglitch', async ()=> {
  engine.stopGlitch();
});
