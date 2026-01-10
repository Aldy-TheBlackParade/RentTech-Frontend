import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-white bg-white/10"
      : "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <aside className="w-64 min-h-screen bg-black text-white px-6 py-8 flex flex-col">
      {/* Logo */}
      <h1 className="text-2xl font-semibold mb-12 tracking-wide">
        Sewa<span className="text-gray-400">Admin</span>
      </h1>

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        <MenuItem
          label="Kelola Kategori"
          icon="📂"
          active={isActive("/admin/category")}
          onClick={() => navigate("/admin/category")}
        />

        <MenuItem
          label="Kelola Item"
          icon="📦"
          active={isActive("/admin/items")}
          onClick={() => navigate("/admin/items")}
        />

        <MenuItem
          label="Konfirmasi Pesanan"
          icon="🟡"
          active={isActive("/admin/konfirmasi")}
          onClick={() => navigate("/admin/konfirmasi")}
        />

        <MenuItem
          label="Pesanan Disewa"
          icon="🟠"
          active={isActive("/admin/disewa")}
          onClick={() => navigate("/admin/disewa")}
        />

        <MenuItem
          label="Pesanan Selesai"
          icon="📄"
          active={isActive("/admin/selesai")}
          onClick={() => navigate("/admin/selesai")}
        />
      </nav>
    </aside>
  );
};

const MenuItem = ({ label, icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${active}`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SidebarAdmin;
