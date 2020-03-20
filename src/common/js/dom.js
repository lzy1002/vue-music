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
