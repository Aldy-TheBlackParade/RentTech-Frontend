import api from "./api";
import uploadimageapi from "./uploadimageapi";

export const getUserById = (id) => {
  return api.get(`/api/users/by-id/${id}`);
};

export const updateUserById = (id, payload) => {
  return uploadimageapi.put(`/api/users/by-id/${id}`, payload);
};
