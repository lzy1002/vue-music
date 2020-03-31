import storage from "good-storage";

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LENGTH = 15;

function insertArray(arr, val, compare, maxLen) {  // 向数组中插入指定内容 并删除数组中已经存在的插入的内容 arr: 要操作的数组  val: 要插入到数组的内容  compare: 查找规则的函数  len: 要操作的数组的最大长度
  const index = arr.findIndex(compare);  // 根据指定的规则查找数组中的索引

  if(index === 0) {  // 判断要插入的内容是否在数组中的位置是第一个 如果是 则return
    return;
  }

  if(index > 0) {  // 如果存在 并且所在位置不是数组中的第一个 那么就需要删除掉数组中的这一项
    arr.splice(index, 1);
  }

  arr.unshift(val);  // 向数组中的最前面添加传入的这一项

  if(maxLen && arr.length > SEARCH_MAX_LENGTH) {  // 添加完毕之后 判断添加完毕的数组的长度是否已经超过了数组的最大长度 如果超过了 那么则删除掉数组中的最后一项
    arr.pop();
  }

}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if(index !== -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch(query) {  // 向本地存储中存入传入的指定项的方法
  const searches = storage.get(SEARCH_KEY, []);  // 获取当前本地存储中存储搜索历史的数组  如果不存在就得到空数组
  insertArray(searches, query, item => item === query, SEARCH_MAX_LENGTH);  // 调用插入项的方法 把当前传入的项插入到从本地存储中获取到的数组中
  storage.set(SEARCH_KEY, searches);  // 然后将插入完毕后的数组再次存储到本地存储中
  return searches;  // 并将插入后的数组return出去
}

export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, item => item === query);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}
