(async ()=>{
  "use strict";
  // ===== Lily Script Start =====
  // [wait time=500]
  await tags.wait({time: 500});
  // [image label="bg" storage="everett_effect" opacity=0.1]
  await tags.image({label: "bg", storage: "everett_effect.jpg", opacity: 0.0});
  // [fade label="bg" opacity=0.1 duration=1000]
  await tags.fade({label: "bg", opacity: 1.0, duration: 1000});
  //
  await tags.image({label: "lily", storage: "M_LILY_A_04a.png", opacity: 0.0, left: 400, top: 100, scale: 1.6});
  await tags.fade({label: "lily", opacity: 1.0, duration: 500});
  // [wait time=500]
  await tags.wait({time: 2000});
  // [fade label="bg" opacity=0.0 duration=500]
  await tags.fade({label: "lily", opacity: 0.0, duration: 500});
  await tags.remove({label: "lily"});
  await tags.fade({label: "bg", opacity: 0.0, duration: 1000});
  // [remove label="bg"]
  await tags.remove({label: "bg"});
  // [wait time=1000]
  await tags.wait({time: 1000});
  // [jump storage="first.js"]
  await tags.call({storage: "first.js"});
  return;
  // ===== Lily Script End =====
})().then(()=>{
  "use strict";
  resolve();
});