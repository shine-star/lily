(async ()=>{
  "use strict";
  // ===== Lily Script Start =====
  // [wait time=1000]
  await tags.wait({time: 1000});
  // [image label="bg" storage="everett_effect" opacity=0.1]
  await tags.image({label: "bg", storage: "everett_effect", opacity: 0.1});
  // [fade label="bg" opacity=0.1 duration=2000]
  await tags.fade({label: "bg", opacity: 1.0, duration: 2000});
  // [wait time=1000]
  await tags.wait({time: 1000});
  // [fade label="bg" opacity=0.0 duration=2000]
  await tags.fade({label: "bg", opacity: 0.0, duration: 2000});
  // [remove label="bg"]
  await tags.remove({label: "bg"});
  // ===== Lily Script End =====
})().then(()=>{
  "use strict";
  resolve();
});