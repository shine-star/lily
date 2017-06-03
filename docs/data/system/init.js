(async ()=>{
  "use strict";
  await engine.loadSystem("control.js");
  await engine.loadSystem("graphics.js");
  await engine.loadSystem("text.js");
})().then(()=>{
  "use strict";
  resolve();
});