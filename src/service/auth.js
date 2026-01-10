import api from "./api";

export const loginUser = (payload) => {
  return api.post("/api/users/login", payload);
};

export const registerUser = (payload) => {
  return api.post("/api/users/register", payload);
};
