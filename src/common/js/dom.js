export function addClass(el, className) {  // 为传入元素添加传入的类名
  if(hasClass(el, className)) return;
  let newClass = el.className.split(" ");
  newClass.push(className);
  el.className = newClass.join(" ");
}

export function hasClass(el, className) {  // 用于判断传入元素的所有类名中是否包含传入的类名 包含则返回true 反之
  let reg = new RegExp("(^|\\s)"+className+"(\\s|$)");
  return reg.test(el.className);
}

export function getData(el, name, value) {  // 用于获取或设置传入元素的自定义属性值 如果value传入了就是设置 反之则是获取
  let prefix = "data-";
  name = prefix + name;
  if(value) {
    return el.setAttribute(name, value);
  }else {
    return el.getAttribute(name);
  }
}

let elementStyle = document.createElement("div").style;
let vendor = (function () {  // 该方法是一个自调用函数 用于检测用户当前是什么浏览器  返回一个兼容前缀
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform"
  };

  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style) {  // 该方法用于将传入的style根据当前是什么浏览器添加对应的前缀
  if(vendor === false) return false;

  if(vendor === "standard") return style;

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
