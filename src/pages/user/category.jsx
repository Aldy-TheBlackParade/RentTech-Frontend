import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/layout/Sidebar";
import Navbar from "../../component/layout/Navbar";
import { getItemsByCategoryId } from "../../service/category";

const Category = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        console.log("📦 CATEGORY ID:", id);

        const res = await getItemsByCategoryId(id);

        console.log("📦 ITEM RESPONSE:", res.data);

        const data = res.data?.data || res.data?.items || res.data;

        setProducts(data || []);
      } catch (error) {
        console.error("❌ Fetch items error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItems();
  }, [id]); // 👈 PENTING: reload saat id berubah

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />

      <main className="flex-1 p-8">
        <Navbar />

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">
            Kategori <span className="text-gray-400 font-normal">›</span>
          </h2>
          <p className="text-gray-600">Produk berdasarkan kategori</p>
        </div>

        {/* Content */}
        <div className="bg-white border rounded-2xl p-6">
          {/* Loading */}
          {loading && (
            <p className="text-sm text-gray-500">Loading produk...</p>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
            <p className="text-sm text-gray-500">
              Tidak ada produk di kategori ini
            </p>
          )}

          {/* Table */}
          {!loading && products.length > 0 && (
            <>
              {/* Head */}
              <div className="grid grid-cols-12 text-sm text-gray-500 font-medium pb-4 border-b">
                <div className="col-span-2">Thumbnail</div>
                <div className="col-span-5">Nama Produk</div>
                <div className="col-span-3">Keterangan</div>
                <div className="col-span-2 text-right">Aksi</div>
              </div>

              {/* Body */}
              <div className="divide-y">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center py-5"
                  >
                    <div className="col-span-2">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                        <img
                          src={
                            item.image_url && item.image_url.length > 0
                              ? `http://localhost:3000/${item.image_url[0]}`
                              : "/images/default.png"
                          }
                          alt={item.item_name}
                          className="object-contain h-16"
                        />
                      </div>
                    </div>

                    <div className="col-span-5">
                      <p className="font-semibold">{item.item_name}</p>
                    </div>

                    <div className="col-span-3 text-sm text-gray-600">
                      {item.description}
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
                      >
                        Klik untuk Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Category;
