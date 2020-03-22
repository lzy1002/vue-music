import axios from "axios";

const instance = axios.create({
  timeout: 5000
});

export function request(config) {
  instance.interceptors.request.use(config => config, err => console.log(err));

  instance.interceptors.response.use(data => data, err => console.log(err));

  return instance(config);

}
