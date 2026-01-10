import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../component/layout/SidebarAdmin";
import NavbarAdmin from "../../component/layout/NavbarAdmin";
import { allPending, approveOrderById } from "../../service/checkout";

const AdminKonfirmasiPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // ======================
  // FETCH PENDING ORDER
  // ======================
  const fetchPendingOrders = async () => {
    try {
      const res = await allPending();
      setOrders(res.data);
    } catch (error) {
      console.error("Gagal mengambil pesanan tertunda", error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // ======================
  // APPROVE ORDER
  // ======================
  const handleApprove = async (orderId) => {
    const confirmApprove = confirm("Yakin ingin mengonfirmasi pesanan ini?");
    if (!confirmApprove) return;

    try {
      await approveOrderById(orderId);
      alert("Pesanan berhasil dikonfirmasi");
      fetchPendingOrders();
    } catch (error) {
      // 🔥 ambil message dari backend
      const message =
        error?.response?.data?.message || "Gagal mengonfirmasi pesanan";

      alert(message);
    }
  };

  // ======================
  // SEARCH USERNAME
  // ======================
  const filteredOrders = orders.filter((order) =>
    order.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />

      <div className="flex-1 p-8">
        <NavbarAdmin />

        <h2 className="text-xl font-semibold mb-4">Konfirmasi Pesanan</h2>

        {/* SEARCH */}
        <div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder="Cari username..."
            className="border rounded-lg px-4 py-2 w-64
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">No</th>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Username</th>
                <th className="px-6 py-4 text-left">Item</th>
                <th className="px-6 py-4 text-left">Jumlah</th>
                <th className="px-6 py-4 text-left">Tgl Sewa</th>
                <th className="px-6 py-4 text-left">Jam Sewa</th>
                <th className="px-6 py-4 text-left">Tgl Kembali</th>
                <th className="px-6 py-4 text-left">Jam Kembali</th>
                <th className="px-6 py-4 text-left">Subtotal</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    Tidak ada pesanan tertunda
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, orderIndex) =>
                  order.details.map((detail, detailIndex) => (
                    <tr key={detail.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {orderIndex + 1}.{detailIndex + 1}
                      </td>
                      <td className="px-6 py-4">{order.id}</td>
                      <td className="px-6 py-4">{order.user.username}</td>

                      <td className="px-6 py-4">{detail.item.item_name}</td>

                      <td className="px-6 py-4">{detail.quantity}</td>

                      <td className="px-6 py-4">
                        {new Date(detail.rental_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4">{detail.rental_hour}</td>
                      <td className="px-6 py-4">
                        {new Date(detail.return_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4">{detail.return_hour}</td>
                      <td className="px-6 py-4 font-medium">
                        Rp {detail.subtotal.toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="px-3 py-1 text-xs rounded-lg
                          bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Konfirmasi
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminKonfirmasiPesanan;
