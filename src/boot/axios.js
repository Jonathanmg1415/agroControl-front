import { boot } from "quasar/wrappers";
import axios from "axios";
import { createPinia } from "pinia";

const api = axios.create({ baseURL: "http://localhost:1337/sapi/" });

const axiosInstanceBaseURL = "http://localhost:1337/sapi/";

const axiosInstance = axios.create({
  baseURL: axiosInstanceBaseURL,
});

export default boot(({ app }) => {
  app.use(createPinia());
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api, axiosInstance };
