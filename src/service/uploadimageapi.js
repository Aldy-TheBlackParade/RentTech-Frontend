import axios from "axios";

const uploadimageapi = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

uploadimageapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  console.log("🔑 ACCESS TOKEN FULL:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default uploadimageapi;
