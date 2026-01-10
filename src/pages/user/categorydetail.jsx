import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../component/layout/Sidebar";
import Navbar from "../../component/layout/Navbar";
import { getItemById } from "../../service/category";
import AddToCartModal from "../../component/popup/AddToCartModal";
import AddToCheckoutModal from "../../component/popup/AddToCheckoutModal";

const ProductDetail = () => {
  const { id } = useParams();
  const [openCartModal, setOpenCartModal] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "http://localhost:3000/";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getItemById(id);
        const data = res.data?.data || res.data;
        setProduct(data);

        if (Array.isArray(data.image_url) && data.image_url.length > 0) {
          setActiveImage(data.image_url[0]);
        } else if (typeof data.image_url === "string") {
          setActiveImage(data.image_url);
        } else {
          setActiveImage("/images/default.png");
        }
      } catch (err) {
        console.error("❌ Fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        Produk tidak ditemukan
      </div>
    );

  const images =
    Array.isArray(product.image_url) && product.image_url.length > 0
      ? product.image_url
      : ["/images/default.png"];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      <Sidebar />
      <main className="flex-1 px-8 py-8 lg:px-12">
        <Navbar />

        <div className="mb-8 mt-4">
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-black transition-colors"
          >
            Home
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-black font-semibold">{product.item_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Galeri Foto */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
              {images.map((img, index) => {
                const fullURL = img.startsWith("http") ? img : baseURL + img;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(fullURL)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === fullURL
                        ? "border-black scale-105 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={fullURL}
                      alt="thumb"
                      className="w-full h-full object-contain p-2 bg-white"
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex-1 bg-white rounded-[2.5rem] p-10 flex items-center justify-center shadow-sm border border-gray-100 min-h-[400px]">
              <img
                src={
                  activeImage.startsWith("http")
                    ? activeImage
                    : baseURL + activeImage
                }
                alt="Main"
                className="max-h-[350px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Info & Action */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-100 h-full flex flex-col">
              <span
                className={`inline-block px-4 py-1 self-start mb-4 text-[10px] font-bold tracking-widest uppercase rounded-full
    ${
      product.status === "Disewa"
        ? "bg-orange-50 text-orange-600"
        : product.stock === 0
        ? "bg-red-50 text-red-600"
        : "bg-blue-50 text-blue-600"
    }`}
              >
                {product.status === "Disewa"
                  ? "Currently Rented"
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Available to Rent"}
              </span>

              <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight">
                {product.item_name}
              </h1>
              <div className="mb-10 mt-1">
                {/* HARGA */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-black">
                    Rp {product.rental_price?.toLocaleString("id-ID")}
                  </span>
                  <span className="text-gray-400 font-medium">/ Hari</span>
                </div>

                {/* STOCK & STATUS */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
                  <span>
                    Stok:{" "}
                    <span className="font-bold text-gray-900">
                      {product.stock ?? 0}
                    </span>
                  </span>

                  <span
                    className={`font-bold uppercase text-xs
        ${
          product.status === "Disewa"
            ? "text-orange-500"
            : product.stock === 0
            ? "text-red-500"
            : "text-green-600"
        }`}
                  >
                    {product.status === "Disewa"
                      ? "Sedang disewa"
                      : product.stock === 0
                      ? "Stok habis"
                      : "Tersedia"}
                  </span>
                </div>
              </div>
              <div className="h-px bg-gray-100 w-full mb-8" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                Deskripsi Produk
              </h4>
              <p className="text-gray-600 leading-relaxed mb-10 flex-grow">
                {product.description || "Tidak ada deskripsi."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setOpenCartModal(true)}
                  className="w-full py-4 bg-gray-100 text-black rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Tambahkan ke Keranjang
                </button>
                <button
                  onClick={() => setOpenCheckoutModal(true)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all transform active:scale-95"
                >
                  Sewa Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddToCartModal
        open={openCartModal}
        onClose={() => setOpenCartModal(false)}
        product={product}
      />
      <AddToCheckoutModal
        open={openCheckoutModal}
        onClose={() => setOpenCheckoutModal(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;
