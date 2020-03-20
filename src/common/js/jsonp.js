import originJsonp from "jsonp";

export default function(url, data, options) {
  url += (url.includes("?") ? "&" : "?") + paramsStr(data);
  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if(!err) {
        resolve(data);
      }else {
        reject(err);
      }
    })
  })
}

function paramsStr(data) {
  let params = "";
  Object.keys(data).forEach(key => {
    let value = data[key] !== undefined ? data[key] : "";
    params += `&${key}=${encodeURIComponent(value)}`;
  });
  return params ? params.substring(1) : "";
}
