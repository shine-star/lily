(async ()=>{
  "use strict";
  // ===== Lily Script Start =====
  // [wait time=500]
  await tags.wait({time: 500});
  // [image label="bg" storage="everett_effect" opacity=0.1]
  await tags.image({label: "bg", storage: "everett_effect.jpg", opacity: 0.0});
  // [fade label="bg" opacity=0.1 duration=1000]
  await tags.fade({label: "bg", opacity: 1.0, time: 1000});
  //
  await tags.image({label: "lily", storage: "M_LILY_A_04a.png", opacity: 0.0, left: 400, top: 100, scale: 1.6});
  await tags.fade({label: "lily", opacity: 1.0, time: 500});

  // 表情変化
  /* 以下のようなスクリプトで実現したいと思っている。
  * ただしsequence内はマクロに括り出すことを推奨とする。たぶん。
  * [parallel]
  *   [fade label=lily opacity=0.0 time=500]
  *   [sequence]
  *     [image label="lily2" storage="M_LILY_B_05b.png" ………割愛]
  *     [fade label="lily2" ………割愛]
  *   [endsequence]
  * [endparallel]
  */
  await Promise.all([
      tags.fade({label: "lily", opacity: 0.0, time: 500}) ,
      (async ()=>{
        await tags.image({label: "lily2", storage: "M_LILY_B_05b.png", opacity: 0.0, left: 400, top: 100, scale: 1.6});
        await tags.fade({label: "lily2", opacity: 1.0, time: 500});
      })()
  ]);

  await tags.relabel({label: "lily2", newlabel: "lily"});

  // ここで、ryoが下に表示されて欲しい（under指定が有効であることの確認）
  await tags.image({label: "ryo", storage: "M_RYO_A_01a.png", opacity: 0.0, left: 800, top: 100, scale: 1.6, under: "lily"});
  await tags.fade({label: "ryo", opacity: 1.0, time: 500});
  // ここで、trumiが間に表示されて欲しい（over指定が有効であることの確認）
  await tags.image({label: "terumi", storage: "M_TERUMI_A_01a.png", opacity: 0.0, left: 600, top: 100, scale: 1.6, over: "ryo"});
  await tags.fade({label: "terumi", opacity: 1.0, time: 500});
  await tags.wait({time: 1000});
  //TODO: accelもしくはeasingFunc指定
  await tags.move({label: "terumi", time: 250, left: 200});
  await tags.move({label: "terumi", time: 500, left: 1000});
  await tags.move({label: "terumi", time: 250, left: 600});

  // [wait time=500]
  await tags.wait({time: 2000});
  // [fade label="bg" opacity=0.0 duration=500]
  await tags.fade({label: "lily", opacity: 0.0, time: 500});
  await tags.remove({label: "lily"});
  await tags.fade({label: "ryo", opacity: 0.0, time: 500});
  await tags.remove({label: "ryo"});
  await tags.fade({label: "terumi", opacity: 0.0, time: 500});
  await tags.remove({label: "terumi"});
  await tags.fade({label: "bg", opacity: 0.0, time: 1000});
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