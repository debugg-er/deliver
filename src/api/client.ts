import axios from "axios";
import qs from "query-string";

(() => {
  const { query } = qs.parseUrl(window.location.href);
  if (query.access_token) {
    window.localStorage.setItem("token", query.access_token.toString());
  }
})();

const token = window.localStorage.getItem("token");

const client = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  paramsSerializer: (params) => qs.stringify(params),
});

client.interceptors.request.use((config) => {
  if (["post", "patch", "delete"].includes(config.method || "")) {
    switch (config?.headers?.["Content-Type"]) {
      case "application/x-www-form-urlencoded":
        config.data = qs.stringify(config.data);
        break;

      case "multipart/form-data":
        const form = new FormData();
        for (const key in config.data) {
          if (config.data[key]) {
            form.append(key, config.data[key]);
          }
        }
        config.data = form;
        break;
    }
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + token,
    };
  }

  return config;
});

function processResponse(obj: { [key: string]: any }): any {
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === "object") {
      processResponse(obj[key]);
      continue;
    }

    // append static url to media resource
    if (key.includes("Path") && obj[key] !== null) {
      obj[key] = process.env.REACT_APP_STATIC_URL + obj[key];
    }

    // parse string date -> Date
    if (key.includes("At") && !isNaN(Date.parse(obj[key]))) {
      obj[key] = new Date(obj[key]);
    }
  }

  return obj;
}

client.interceptors.response.use(
  (response) => (response?.data?.data ? processResponse(response.data.data) : undefined),
  (error) => {
    if (axios.isCancel(error)) throw error;
    else throw error.response;
  }
);

export default client;
