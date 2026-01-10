import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createCheckouts } from "../../service/checkout";

const AddToCartModal = ({ open, onClose, product }) => {
  const navigate = useNavigate(); // Inisialisasi navigate
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rental_date: "",
    rental_hour: "",
    return_date: "",
    quantity: 1,
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Validasi input
    if (!form.rental_date || !form.rental_hour || !form.return_date) {
      alert("❗ Lengkapi tanggal & jam sewa");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        rental_date: form.rental_date,
        rental_hour: form.rental_hour,
        return_date: form.return_date,
        quantity: Number(form.quantity),
        status: "Tertunda",
        item_id: product.id,
        price: product.rental_price,
      };

      console.log("Mengirim data ke cart:", payload);

      const response = await createCheckouts(payload);

      // Cek apakah request berhasil (biasanya axios melempar error ke catch jika status 4xx/5xx)
      if (response) {
        console.log("Berhasil:", response);
        onClose(); // Tutup modal
        navigate("/order"); // Pindah ke halaman cart
      }
    } catch (err) {
      // Menampilkan detail error di console untuk debugging
      console.error(
        "❌ Add to cart error detail:",
        err.response?.data || err.message
      );
      alert(
        `❌ Gagal: ${
          err.response?.data?.message || "Terjadi kesalahan pada server"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Sewa Sekarang</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tanggal Sewa
            </label>
            <input
              type="date"
              name="rental_date"
              value={form.rental_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Jam Sewa
            </label>
            <input
              type="time"
              name="rental_hour"
              value={form.rental_hour}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Tanggal Kembali
            </label>
            <input
              type="date"
              name="return_date"
              value={form.return_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Jumlah Unit
            </label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-all"
          >
            {loading ? "Memproses..." : "Sewa Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
