import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../component/layout/SidebarAdmin";
import NavbarAdmin from "../../component/layout/NavbarAdmin";
import { allfinish } from "../../service/checkout";

const AdminPesananSelesai = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchFinishedOrders = async () => {
      try {
        const res = await allfinish();
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan selesai", error);
      }
    };

    fetchFinishedOrders();
  }, []);

  useEffect(() => {
    const result = orders.filter((order) =>
      order.user?.username?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(result);
  }, [search, orders]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Navbar */}
        <NavbarAdmin />

        {/* Page Title */}
        <h2 className="text-xl font-semibold mb-4">Pesanan Selesai</h2>

        <div className="flex justify-end mb-6">
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
              />
            </svg>

            <input
              type="text"
              placeholder="Cari username..."
              className="border rounded-lg pl-10 pr-4 py-2 w-64
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
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
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    Tidak ada pesanan selesai
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, orderIndex) =>
                  order.details.map((detail, detailIndex) => (
                    <tr key={detail.id} className="hover:bg-gray-50 transition">
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
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          {order.status}
                        </span>
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

export default AdminPesananSelesai;
