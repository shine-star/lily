let Script = async function() {
  "use strict";
  //TODO: this省略したいなーできないのかなー

  await this.wait({time: 1000});
  // [image label="bg" storage="everett_effect" opacity=0.1]
  await this.image({label: "bg", storage:"everett_effect", opacity: 0.1});
  // [fade label="bg" opacity=0.1 duration=2000]
  await this.fade({label: "bg", opacity: 1.0, duration: 2000});
  // [wait time=1000]
  await this.wait({time: 1000});
  // [fade label="bg" opacity=0.0 duration=2000]
  await this.fade({label: "bg", opacity: 0.0, duration: 2000});
  // [fade label="bg"]
  await this.remove({label: "bg"});
};

export default Script;

// TODO: 外部からこのスクリプトを呼び出す方法はちょっと考えなきゃならないなぁ。非同期で呼び出せるようにするべき。
// ファイル名を隠蔽したいから、manifestを参照するような方式にしたい。よくあるmd5ハッシュのファイル名ですかね。