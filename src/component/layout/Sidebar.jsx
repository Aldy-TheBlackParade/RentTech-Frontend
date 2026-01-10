import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllCategories } from "../../service/category";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openCategory, setOpenCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "text-white bg-white/10"
      : "text-gray-400 hover:text-white hover:bg-white/5";

  // 🔥 GET CATEGORY FROM API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategory(true);
        const res = await getAllCategories();

        console.log("📦 CATEGORY RESPONSE:", res.data);

        const data = res.data?.data || res.data?.categories || res.data;

        setCategories(data || []);
      } catch (err) {
        console.error("❌ Fetch category error:", err);
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-black text-white px-6 py-8 flex flex-col">
      {/* Logo */}
      <h1 className="text-2xl font-semibold mb-12 tracking-wide">
        Sewa<span className="text-gray-400">Tech</span>
      </h1>

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        {/* Home */}
        <MenuItem
          label="Home"
          icon="🏠"
          active={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
        />

        {/* Category Dropdown */}
        <div>
          <button
            onClick={() => setOpenCategory(!openCategory)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <span>Kategori</span>
            </div>

            <span
              className={`transition-transform ${
                openCategory ? "rotate-180" : ""
              }`}
            >
              ⌄
            </span>
          </button>

          {openCategory && (
            <ul className="mt-2 ml-10 space-y-1 text-sm text-gray-400">
              {loadingCategory && (
                <li className="text-xs text-gray-500">Loading...</li>
              )}

              {!loadingCategory &&
                categories.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => navigate(`/category/${item.id}`)}
                    className="cursor-pointer px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition"
                  >
                    {item.category_name}
                  </li>
                ))}

              {!loadingCategory && categories.length === 0 && (
                <li className="text-xs text-gray-500">Tidak ada kategori</li>
              )}
            </ul>
          )}
        </div>

        {/* Cart */}
        <MenuItem
          label="Keranjang"
          icon="🛒"
          active={isActive("/cart")}
          onClick={() => navigate("/cart")}
        />

        {/* Order */}
        <MenuItem
          label="Pemesanan"
          icon="📄"
          active={isActive("/order")}
          onClick={() => navigate("/order")}
        />
      </nav>
    </aside>
  );
};

/* ================= COMPONENT ================= */

const MenuItem = ({ label, icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${active}`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Sidebar;
