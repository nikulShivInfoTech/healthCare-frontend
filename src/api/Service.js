
import axios from "axios";

export const axiosApiClient = axios.create({
  baseURL: "",
});

axiosApiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {

      config.headers["Authorization"] = `Bearer ${token.replace(/"/g, "")}`;
    }
    return config;
  },
  function (error) {
    console.log(error, "ERROR FROM API.JS");
    return Promise.reject(error);
  }
);
