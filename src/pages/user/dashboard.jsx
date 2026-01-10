import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../component/layout/Sidebar";
import Navbar from "../../component/layout/Navbar";
import { getAllItems } from "../../service/category";
import api from "../../service/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const IMAGE_BASE_URL = api.defaults.baseURL + "/";

  const getImage = (img) => {
    if (!img) return "/images/default.png";
    return img.startsWith("http") ? img : IMAGE_BASE_URL + img;
  };

  const [items, setItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);

  useEffect(() => {
    getAllItems()
      .then((res) => {
        const allData = [...res.data].sort((a, b) => b.id - a.id);
        // Ambil 5 item terbaru untuk Slider
        setLatestItems(allData.slice(0, 5));
        // Ambil 4 item untuk grid bawah
        setItems(allData.slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 lg:px-12">
        <Navbar />

        {/* ===== CLEAN LIGHT BANNER ===== */}
        <section className="relative mt-8 mb-16">
          <div className="relative z-10 bg-white border border-gray-100 rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] min-h-[400px] flex items-center overflow-hidden">
            <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-12 items-center gap-10">
              {/* Bagian Teks */}
              <div className="md:col-span-7 relative z-20 py-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-blue-50/50 border border-blue-100/50 rounded-full">
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-blue-600">
                    Koleksi Terbaru
                  </span>
                </div>

                <h2 className="text-5xl font-black leading-[1.1] mb-5 text-[#1A1A1A] tracking-tight">
                  Upgrade Tech <br />
                  <span className="text-blue-600">Upgrade Gaya Hidupmu.</span>
                </h2>

                <p className="text-gray-500 mb-8 text-lg max-w-sm leading-relaxed">
                  Dapatkan pengalaman gadget tercanggih dengan diskon sewa{" "}
                  <span className="text-black font-bold">20%</span>.
                </p>
              </div>

              {/* Bagian Slider (Symmetry Fix) */}
              <div className="md:col-span-5 flex justify-center items-center">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  // pb-12 untuk memberi ruang agar gambar tepat di tengah di atas bullets
                  className="w-full h-full pb-12 light-swiper"
                >
                  {latestItems.map((product) => (
                    <SwiperSlide
                      key={product.id}
                      className="flex justify-center items-center"
                    >
                      <div
                        className="cursor-pointer group flex items-center justify-center"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={getImage(product.image_url?.[0])}
                          alt={product.item_name}
                          className="h-[280px] w-auto object-contain transition-all duration-500 group-hover:scale-105"
                          style={{
                            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        {/* ===== GRID BARANG TERBARU ===== */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
                Barang Terbaru
              </h3>
              <p className="text-sm text-gray-400">
                Pilihan terbaik untuk produktivitasmu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="group bg-white rounded-[2.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer"
              >
                <div className="relative overflow-hidden bg-[#F8F9FA] rounded-[2rem] h-52 flex items-center justify-center mb-5">
                  <img
                    src={getImage(item.image_url?.[0])}
                    alt={item.item_name}
                    className="max-h-36 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-gray-400 shadow-sm">
                    NEW
                  </div>
                </div>

                <div className="px-2">
                  <h4 className="font-bold text-[#1A1A1A] text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                    {item.item_name}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-400 font-medium">
                      Rp
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      {item.rental_price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      / hari
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Pagination Styling agar Bullets Pas di Tengah */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .light-swiper .swiper-pagination { bottom: 0px !important; }
        .light-swiper .swiper-pagination-bullet { background: #E2E8F0 !important; opacity: 1; }
        .light-swiper .swiper-pagination-bullet-active { background: #2563EB !important; width: 20px; border-radius: 10px; transition: all 0.3s; }
      `,
        }}
      />
    </div>
  );
};

export default Dashboard;
