import api from "./api";

export const getCheckoutsByUser = () => {
  return api.get("/api/checkouts/all/by-user");
};

export const createCheckouts = (payload) => {
  return api.post("/api/checkouts/", payload);
};

export const cancelOrder = (id) => {
  return api.put(`/api/checkouts/canceled/by-orderid/${id}`);
};

export const allPending = () => {
  return api.get("/api/checkouts/allpending");
};

export const allRented = () => {
  return api.get("/api/checkouts/allrented");
};

export const allfinish = () => {
  return api.get("/api/checkouts/allfinished");
};

export const approveOrderById = (id) => {
  return api.put(`/api/checkouts/approved/by-orderid/${id}`);
};

export const finishOrderById = (id) => {
  return api.put(`/api/checkouts/finished/by-orderid/${id}`);
};
