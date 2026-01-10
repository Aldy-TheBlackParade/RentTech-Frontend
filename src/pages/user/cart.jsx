import React, { useEffect, useState } from "react";
import Sidebar from "../../component/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/layout/Navbar";
import {
  getCarts,
  updateCartById,
  deleteCartById,
  checkoutCart,
} from "../../service/card";

let debounceTimer = null;

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      const res = await getCarts();
      // Mengambil data dari res.data.data atau res.data
      const carts = res.data?.data || res.data || [];

      const mapped = carts.flatMap((cart) =>
        cart.details.map((detail) => ({
          cartId: cart.id, // ID Grup (Misal: 21)
          detailId: detail.id, // ID Detail (Misal: 36) -> DIPAKAI UPDATE & DELETE
          checked: false,

          name: detail.item.item_name,
          price: detail.item.rental_price,
          image: detail.item.image_url?.[0]
            ? `http://localhost:3000/${detail.item.image_url[0]}`
            : "",

          qty: detail.quantity || 1,
          // PERBAIKAN: Ambil dari detail, bukan cart. Gunakan "" jika null/undefined
          startDate: detail.rental_date ? detail.rental_date.slice(0, 10) : "",
          endDate: detail.return_date ? detail.return_date.slice(0, 10) : "",
          time: detail.rental_hour || "",
        }))
      );

      setItems(mapped);
    } catch (err) {
      console.error("❌ fetch cart error", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= CHECKBOX ================= */
  const allChecked = items.length > 0 && items.every((i) => i.checked);

  const toggleAll = (checked) => {
    setItems(items.map((i) => ({ ...i, checked })));
  };

  const toggleItem = (id) => {
    setItems(
      items.map((i) => (i.detailId === id ? { ...i, checked: !i.checked } : i))
    );
  };

  /* ================= AUTO SAVE (FIXED) ================= */
  const updateItem = (item, field, value) => {
    // Update local state terlebih dahulu (Optimistic Update)
    const updated = items.map((i) =>
      i.detailId === item.detailId ? { ...i, [field]: value } : i
    );
    setItems(updated);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        // PERBAIKAN: Kirim detailId dan pastikan payload lengkap
        const payload = {
          rental_date: field === "startDate" ? value : item.startDate,
          rental_hour: field === "time" ? value : item.time,
          return_date: field === "endDate" ? value : item.endDate,
          quantity: field === "qty" ? value : item.qty,
        };

        console.log("Updating detail ID:", item.detailId, payload);

        await updateCartById(item.detailId, payload);
        console.log("✅ auto saved");
      } catch (err) {
        console.error("❌ autosave error", err.response?.data || err.message);
      }
    }, 800);
  };

  /* ================= DELETE ================= */
  const removeItem = async (item) => {
    if (!confirm(`Hapus ${item.name} dari keranjang?`)) return;

    try {
      await deleteCartById(item.detailId);
      alert("✅ Item berhasil dihapus");
      fetchCart();
    } catch (err) {
      console.error("❌ delete error", err);
      alert("❌ Gagal menghapus item");
    }
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    const detailIds = items.filter((i) => i.checked).map((i) => i.detailId);

    if (detailIds.length === 0) {
      alert("Pilih item terlebih dahulu");
      return;
    }

    try {
      await checkoutCart(detailIds);
      alert("✅ Checkout berhasil");
      navigate("/order");
    } catch (err) {
      console.error("❌ checkout error", err);
      alert("❌ Checkout gagal");
    }
  };

  const getRentalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end - start;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    return Math.max(durationDays, 1); // minimal 1 hari
  };

  const total = items
    .filter((i) => i.checked)
    .reduce(
      (sum, i) => sum + i.price * i.qty * getRentalDays(i.startDate, i.endDate),
      0
    );

  const totalChecked = items.filter((i) => i.checked).length;

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] text-black">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Navbar />

        <h1 className="text-2xl font-semibold mb-8">
          Keranjang <span className="text-gray-500 font-normal">›</span>
        </h1>

        <section className="bg-white rounded-3xl shadow-sm divide-y mb-32">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.detailId}
                className="flex items-center gap-6 px-6 py-6"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.detailId)}
                  className="accent-black w-5 h-5"
                />

                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Rp {item.price.toLocaleString()} / Hari
                  </p>

                  <div className="flex gap-3 mt-3">
                    <input
                      type="date"
                      value={item.startDate || ""}
                      onChange={(e) =>
                        updateItem(item, "startDate", e.target.value)
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="time"
                      value={item.time || ""}
                      onChange={(e) => updateItem(item, "time", e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="date"
                      value={item.endDate || ""}
                      onChange={(e) =>
                        updateItem(item, "endDate", e.target.value)
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateItem(item, "qty", Math.max(1, item.qty - 1))
                    }
                    className="px-3 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 bg-gray-50">{item.qty}</span>
                  <button
                    onClick={() => updateItem(item, "qty", item.qty + 1)}
                    className="px-3 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="w-32 text-right font-bold text-lg">
                  Rp{" "}
                  {(
                    item.price *
                    item.qty *
                    getRentalDays(item.startDate, item.endDate)
                  ).toLocaleString()}
                </div>

                <button
                  onClick={() => removeItem(item)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-2xl px-2"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              Keranjang kosong
            </div>
          )}
        </section>

        {/* BOTTOM BAR */}
        <div className="fixed bottom-0 left-[260px] right-0 bg-white/80 backdrop-blur-md border-t px-10 py-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
              className="accent-black w-5 h-5"
            />
            <span className="text-sm font-medium">Pilih Semua</span>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                Total Pembayaran
              </p>
              <p className="text-2xl font-black text-black">
                Rp {total.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/20"
            >
              Checkout ({totalChecked})
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
