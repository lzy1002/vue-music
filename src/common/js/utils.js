function getRandomInt(min, max) {  // 获取指定范围的随机数
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {  // 洗牌算法  对数组进行乱序
  let _arr = [...arr];
  for(let i = 0; i< _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
