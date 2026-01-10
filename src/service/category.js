import api from "./api";

// =====================
// CATEGORY API
// =====================

// GET semua kategori
export const getAllCategories = () => {
  return api.get("/api/categories/all");
};

// UPDATE (EDIT)
export const updateCategoryById = (id, payload) => {
  return api.put(`/api/categories/by-id/${id}`, payload);
};

// POST tambah kategori
export const createCategory = (payload) => {
  return api.post("/api/categories/", payload);
};

// DELETE kategori
export const deleteCategoryById = (id) => {
  return api.delete(`/api/categories/by-id/${id}`);
};

// =====================
// ITEM API (yang sudah ada)
// =====================

export const getItemsByCategoryId = (categoryId) => {
  return api.get(`/api/items/by-categoryid/${categoryId}`);
};

export const getItemById = (id) => {
  return api.get(`/api/items/by-id/${id}`);
};

export const getAllItems = () => {
  return api.get("/api/items/all");
};

// CREATE item (multipart)
export const createItem = (formData) => {
  return api.post("/api/items/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE item (multipart)
export const updateItemById = (id, formData) => {
  return api.put(`/api/items/by-id/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE item
export const deleteItemById = (id) => {
  return api.delete(`/api/items/by-id/${id}`);
};

// =====================
// CART API
// =====================

export const createCart = (payload) => {
  return api.post("/api/carts/", payload);
};
