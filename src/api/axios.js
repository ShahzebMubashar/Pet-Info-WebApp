import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // adjust this to your API URL
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
