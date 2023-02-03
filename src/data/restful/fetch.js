import axios from "axios";

const getUri = () => {
  return "https://api-prod.wisburg.com/v1";
};

let fetch = axios.create({
  baseURL: getUri(), // 这里是本地express启动的服务地址
  timeout: 50000, // request timeout
});

fetch.interceptors.request.use(
  (config) => {
    if (!config.headers["x-hufu-token"]) {
      const token = localStorage.getItem("x-token");
      if (token) {
        const t = JSON.parse(token);
        config.headers["x-hufu-token"] = t;
      } else {
        config.headers["x-hufu-token"] = "";
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

fetch.interceptors.response.use(
  async ({ data }) => {
    if (data.message !== "ok") {
      return Promise.reject(data.message);
    }

    return data.data;
  },
  (error) => {
    const response = error.response;
    if (response) {
      const { status, config, data } = response;
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default fetch;
