import React, { useEffect, useState, useRef } from "react";
import SidebarAdmin from "../../component/layout/SidebarAdmin";
import NavbarAdmin from "../../component/layout/NavbarAdmin";
import {
  getAllItems,
  createItem,
  updateItemById,
  deleteItemById,
  getAllCategories,
} from "../../service/category";

const AdminItems = () => {
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // ======================
  // FORM STATE
  // ======================
  const [form, setForm] = useState({
    category_id: "",
    item_code: "",
    item_name: "",
    description: "",
    rental_price: "",
    stock: "",
    status: "Tersedia",
  });

  const [images, setImages] = useState([]); // FILE[]
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // ======================
  // FETCH DATA
  // ======================
  const fetchItems = async () => {
    const res = await getAllItems();
    setItems(res.data);
  };

  const fetchCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // ======================
  // HANDLER
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ======================
  // CREATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("category_id", Number(form.category_id));
      formData.append("item_code", form.item_code);
      formData.append("item_name", form.item_name);
      formData.append("description", form.description);
      formData.append("rental_price", Number(form.rental_price));
      formData.append("stock", Number(form.stock));
      formData.append("status", form.status);

      // 👉 GAMBAR HANYA DIKIRIM JIKA ADA
      if (images.length > 0) {
        images.forEach((file) => {
          formData.append("image_url", file);
        });
      }

      if (editId) {
        // ===== EDIT =====
        await updateItemById(editId, formData);
      } else {
        // ===== CREATE =====
        await createItem(formData);
      }

      // RESET
      setForm({
        category_id: "",
        item_code: "",
        item_name: "",
        description: "",
        rental_price: "",
        stock: "",
        status: "Tersedia",
      });
      setImages([]);
      setEditId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan item");
    }
  };

  // ======================
  // EDIT
  // ======================
  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      category_id: item.category_id,
      item_code: item.item_code,
      item_name: item.item_name,
      description: item.description,
      rental_price: item.rental_price,
      stock: item.stock,
      status: item.status,
    });
    setImages([]);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", Number(form.category_id));
    formData.append("item_code", form.item_code);
    formData.append("item_name", form.item_name);
    formData.append("description", form.description);
    formData.append("rental_price", Number(form.rental_price));
    formData.append("stock", Number(form.stock));
    formData.append("status", form.status);

    images.forEach((file) => {
      formData.append("image_url", file);
    });

    await updateItemById(editId, formData);
    setIsEditOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus item ini?")) return;
    await deleteItemById(id);
    fetchItems();
  };

  const itemsByCategory = categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category_id === category.id),
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        <NavbarAdmin />
        <h2 className="text-xl font-semibold mb-6">Manajemen Item</h2>

        {/* FORM CREATE */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>

            <input
              name="item_code"
              placeholder="Kode Item"
              className="input"
              onChange={handleChange}
              value={form.item_code}
            />
            <input
              name="item_name"
              placeholder="Nama Item"
              className="input"
              onChange={handleChange}
              value={form.item_name}
            />
            <input
              type="number"
              name="rental_price"
              placeholder="Harga Sewa"
              className="input"
              onChange={handleChange}
              value={form.rental_price}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stok"
              className="input"
              onChange={handleChange}
              value={form.stock}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option>Tersedia</option>
              <option>Disewa</option>
            </select>

            <textarea
              name="description"
              placeholder="Deskripsi"
              className="col-span-2 input h-28"
              onChange={handleChange}
              value={form.description}
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="col-span-2"
              ref={fileInputRef}
            />

            <button className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Simpan Item
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="space-y-10">
          {itemsByCategory.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              {/* JUDUL KATEGORI */}
              <div className="px-6 py-4 bg-gray-100 font-semibold">
                {category.category_name}
              </div>

              {/* TABLE WRAPPER */}
              <div>
                <table className="min-w-full table-fixed border-collapse text-sm">
                  {/* HEADER */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 w-1/4 text-left">Kode Item</th>
                      <th className="px-6 py-4 w-1/4 text-left">Nama Item</th>
                      <th className="px-6 py-4 w-1/6 text-left">Harga</th>
                      <th className="px-6 py-4 w-1/12 text-left">Stok</th>
                      <th className="px-6 py-4 w-1/6 text-left">Status</th>
                      <th className="px-6 py-4 w-1/4 text-left">Aksi</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody className="divide-y">
                    {category.items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-400"
                        >
                          Tidak ada item di kategori ini
                        </td>
                      </tr>
                    ) : (
                      category.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 font-medium">
                            {item.item_code}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {item.item_name}
                          </td>
                          <td className="px-6 py-4">
                            Rp {item.rental_price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">{item.stock}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                item.status === "Tersedia"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-3">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminItems;
