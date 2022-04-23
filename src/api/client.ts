import axios from "axios";
import qs from "query-string";

import processResponse from "@utils/processResponse";

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
    "Content-Type": "application/json",
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
      Authorization: "Bearer " + token,
      ...config.headers,
    };
  }

  return config;
});

client.interceptors.response.use(
  (response) => (response?.data?.data ? processResponse(response.data.data) : undefined),
  (error) => {
    if (axios.isCancel(error)) throw error;
    else throw error.response;
  }
);

export default client;
