let Script = function() {
  "use strict";
  bgimage("image.png");
};

export default Script;

// TODO: 外部からこのスクリプトを呼び出す方法はちょっと考えなきゃならないなぁ。非同期で呼び出せるようにするべき。
// ファイル名を隠蔽したいから、manifestを参照するような方式にしたい。よくあるmd5ハッシュのファイル名ですかね。