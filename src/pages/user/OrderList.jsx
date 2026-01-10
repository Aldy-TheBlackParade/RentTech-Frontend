import React, { useEffect, useState } from "react";
import Sidebar from "../../component/layout/Sidebar";
import Navbar from "../../component/layout/Navbar";
import { cancelOrder, getCheckoutsByUser } from "../../service/checkout";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL untuk gambar (sesuaikan dengan API kamu)
  const IMAGE_BASE_URL = "http://localhost:3000/";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getCheckoutsByUser();
      const data = res.data?.data || res.data || [];
      setOrders(data);
    } catch (err) {
      console.error("❌ gagal ambil order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm("Yakin mau membatalkan pesanan ini?");
    if (!confirm) return;

    try {
      await cancelOrder(orderId);
      alert("Pesanan berhasil dibatalkan");

      // refresh data setelah cancel
      fetchOrders();
    } catch (err) {
      console.error("❌ gagal batalin pesanan:", err);
      alert("Gagal membatalkan pesanan");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Tertunda":
        return "bg-yellow-100 text-yellow-700";
      case "Disewa":
        return "bg-orange-100 text-orange-600";
      case "Selesai":
        return "bg-green-100 text-green-600";
      case "Dibatalkan":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleContactAdmin = (order) => {
    const adminPhone = "6281389954937"; // GANTI nomor admin
    const user = JSON.parse(localStorage.getItem("user"));
    const itemNames = order.details
      ?.map((detail, index) => `${index + 1}. ${detail.item.item_name}`)
      .join("\n");
    const message = `Halo Admin,
Saya ingin konfirmasi pesanan.

Order ID: ${order.id}
Username: ${user?.username}
Item:
${itemNames}
Total: Rp ${order.subtotal?.toLocaleString("id-ID")}

Terima kasih.`;

    const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(waUrl, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="flex-1 p-8">
        <Navbar />

        <h2 className="text-2xl font-bold mb-6">Pesanan Saya</h2>

        {loading && <p className="text-gray-500">Memuat data pesanan...</p>}

        {!loading && orders.length === 0 && (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 italic">
              Belum ada pesanan yang pending.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">
                    Order ID: <span className="text-gray-800">#{order.id}</span>
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status || "Tertunda"}
                </span>
              </div>

              {/* ITEM LIST */}
              <div className="space-y-3">
                {order.details?.map((detail) => {
                  const imgPath = detail.item?.image_url?.[0];
                  const fullImgUrl = imgPath
                    ? `${IMAGE_BASE_URL}${imgPath}`
                    : "https://via.placeholder.com/150";

                  return (
                    <div
                      key={detail.id}
                      className="flex items-center gap-4 border border-gray-50 bg-gray-50/50 rounded-xl p-3"
                    >
                      <img
                        src={fullImgUrl}
                        alt={detail.item?.item_name}
                        className="w-16 h-16 object-contain bg-white rounded-lg border"
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {detail.item?.item_name || "Produk Tidak Diketahui"}
                        </p>

                        <p className="text-sm text-gray-500">
                          📅 Sewa:{" "}
                          {detail.rental_date
                            ? new Date(detail.rental_date).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}{" "}
                          • {detail.rental_hour || "--:--"}
                        </p>

                        <p className="text-sm text-gray-500">
                          🏁 Kembali:{" "}
                          {detail.return_date
                            ? new Date(detail.return_date).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}{" "}
                          • {detail.return_hour || "--:--"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {detail.duration} hari • {detail.quantity} unit
                        </p>
                      </div>

                      <p className="font-bold text-gray-900">
                        Rp {(detail.subtotal || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center pt-4 border-t border-dashed">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Total Pembayaran
                  </p>
                  <p className="text-xl font-black text-black">
                    Rp {(order.subtotal || 0).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex gap-3">
                  {/* 🔴 Tombol Batal — HANYA kalau Tertunda */}
                  {order.status === "Tertunda" && (
                    <button
                      className="px-5 py-2.5 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all active:scale-95"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Batal
                    </button>
                  )}

                  {/* ⚫ Hubungi Admin */}
                  <button
                    disabled={
                      order.status === "Selesai" ||
                      order.status === "Dibatalkan" ||
                      order.status === "Disewa"
                    }
                    className={`px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all ${
                      order.status === "Selesai" ||
                      order.status === "Dibatalkan" ||
                      order.status === "Disewa"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800 active:scale-95"
                    }`}
                    onClick={() => handleContactAdmin(order)}
                  >
                    Hubungi Admin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrderList;
