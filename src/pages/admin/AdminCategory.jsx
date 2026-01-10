import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../component/layout/SidebarAdmin";
import NavbarAdmin from "../../component/layout/NavbarAdmin";
import {
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../../service/category";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // EDIT STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // ======================
  // GET ALL CATEGORY
  // ======================
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal mengambil kategori", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ======================
  // CREATE CATEGORY
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setLoading(true);
      await createCategory({
        category_name: categoryName,
      });

      setCategoryName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah kategori");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // OPEN EDIT MODAL
  // ======================
  const openEditModal = (category) => {
    setEditId(category.id);
    setEditName(category.category_name);
    setIsEditOpen(true);
  };

  // ======================
  // UPDATE CATEGORY
  // ======================
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await updateCategoryById(editId, {
        category_name: editName,
      });

      setIsEditOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Gagal update kategori", err);
    }
  };

  // ======================
  // DELETE CATEGORY
  // ======================
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus kategori ini?");
    if (!confirmDelete) return;

    try {
      await deleteCategoryById(id);
      fetchCategories();
    } catch (err) {
      console.error("Gagal menghapus kategori", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Navbar */}
        <NavbarAdmin />

        {/* Page Title */}
        <h2 className="text-xl font-semibold mb-6">
          Manajemen Kategori Barang
        </h2>

        {/* FORM TAMBAH */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              placeholder="Nama kategori"
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Tambah"}
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">No</th>
                <th className="px-6 py-4 text-left">Nama Kategori</th>
                <th className="px-6 py-4 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    Tidak ada data kategori
                  </td>
                </tr>
              )}

              {categories.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">
                    {item.category_name}
                  </td>
                  <td className="px-6 py-4 flex gap-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Kategori</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
