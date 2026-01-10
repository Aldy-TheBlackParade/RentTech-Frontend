import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Canon70D from "./assets/CanonEOS7D.png";
import ip from "./assets/Iphone16.jpeg";
import ipong from "./assets/iphong.jpeg";
import Sony from "./assets/Sonyy.jpeg";
import SonR from "./assets/SonyReview.jpeg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter italic">
          RentTech.
        </h1>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all transform active:scale-95 shadow-lg shadow-black/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 px-10 lg:px-20 bg-[#F8F9FA]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-black text-white rounded-full">
              Premium Tech Rental
            </span>
            <h2 className="text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter">
              Capture moments, <br />
              <span className="text-gray-400">not expenses.</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
              Sewa kamera profesional dan smartphone terbaru tanpa beban biaya
              tinggi. Siap mendukung kreativitasmu dalam hitungan jam.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="user"
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold">10k+ Creators</p>
                <p className="text-gray-400">Trust our gears daily</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative z-10 w-full max-w-lg">
              <img
                src={Canon70D}
                alt="Main"
                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)]"
              />
            </div>
            {/* Floating Card (Tanpa Animasi) */}
            <div className="absolute right-0 bottom-10 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl p-5 w-52 border border-white/50 z-20">
              <img
                src={ip}
                alt="Phone"
                className="rounded-2xl mb-4 shadow-sm"
              />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Featured
              </p>
              <p className="text-sm font-extrabold">iPhone 16 Pro Max</p>
              <p className="text-xs text-blue-600 font-bold mt-1">
                Rp 300k / hari
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Top-Tier Gear",
              desc: "Kamera & HP kondisi 100% prima dan terupdate.",
            },
            {
              title: "Flat Pricing",
              desc: "Harga transparan tanpa biaya asuransi tersembunyi.",
            },
            {
              title: "Instant Delivery",
              desc: "Pesan sekarang, sampai di lokasi dalam 2 jam.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-black transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 font-black group-hover:bg-black group-hover:text-white transition-colors">
                0{idx + 1}
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORY PREVIEW ===== */}
      <section className="py-24 px-10 bg-black text-white rounded-t-[4rem]">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <span className="text-blue-400 font-bold tracking-[0.3em] uppercase text-[10px]">
              Explore Catalog
            </span>
            <h3 className="text-4xl lg:text-5xl font-extrabold mt-4 mb-8 leading-tight">
              Peralatan Terbaik <br /> Untuk Kreativitas Tanpa Batas
            </h3>
            <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Browse All Items
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="relative h-80 rounded-[2.5rem] overflow-hidden group">
              <img
                src={ipong}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                <h4 className="font-bold text-xl">Smartphones</h4>
              </div>
            </div>
            <div className="relative h-80 rounded-[2.5rem] overflow-hidden group mt-12">
              <img
                src={Sony}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                <h4 className="font-bold text-xl">Cameras</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASE / GALLERY ===== */}
      <section className="py-24 px-10 bg-[#F8F9FA]">
        <h3 className="text-3xl font-black mb-12 text-center tracking-tight">
          Real Gear, Real Stories.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            SonR,
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
          ].map((img, i) => (
            <div
              key={i}
              className="rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-gray-100 transition-transform duration-300 hover:scale-[0.98]"
            >
              <img
                src={img}
                className="h-64 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                alt="gallery"
              />
              <p className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                {["Content Creator", "Event Coverage", "Digital Nomad"][i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-10 py-16 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-sm font-medium text-gray-400">
          © 2026 RentTech. Built for Creators.
        </p>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-black transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
