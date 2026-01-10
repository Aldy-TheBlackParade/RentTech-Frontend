import api from "./api";

// GET semua cart user
export const getCarts = () => {
  return api.get("/api/carts/");
};

// UPDATE cart by id
export const updateCartById = (id, payload) => {
  return api.put(`/api/carts/by-id/${id}`, payload);
};

// DELETE cart by id
export const deleteCartById = (id) => {
  return api.delete(`/api/carts/by-id/${id}`);
};

export const checkoutCart = (detailIds) =>
  api.post("/api/carts/checkout", {
    order_detail_ids: detailIds,
  });
