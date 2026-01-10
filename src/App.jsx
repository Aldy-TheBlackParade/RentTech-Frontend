import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/user/dashboard";
import Profile from "./pages/user/profileuser";
import EditProfile from "./component/popup/popupeditprofile";
import Category from "./pages/user/category";
import ProductDetail from "./pages/user/categorydetail";
import LandingPage from "./LandingPage";
import Cart from "./pages/user/cart";
import Order from "./pages/user/OrderList";
import AdminPesananSelesai from "./pages/admin/AdminPesananSelesai";
import AdminCategory from "./pages/admin/AdminCategory";
import AdminItems from "./pages/admin/AdminItems";
import AdminPesananDisewa from "./pages/admin/AdminPesananDisewa";
import AdminKonfirmasi from "./pages/admin/AdminKonfirmasiPesanan";
import "./index.css";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />

        {/* Halaman user yang butuh login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:id"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/selesai"
          element={
            <ProtectedRoute>
              <AdminPesananSelesai />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/disewa"
          element={
            <ProtectedRoute>
              <AdminPesananDisewa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/konfirmasi"
          element={
            <ProtectedRoute>
              <AdminKonfirmasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <ProtectedRoute>
              <AdminCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <ProtectedRoute>
              <AdminItems />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
