import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../component/layout/Sidebar";
import SidebarAdmin from "../../component/layout/SidebarAdmin";
import Navbar from "../../component/layout/Navbar";
import NavbarAdmin from "../../component/layout/NavbarAdmin";
import EditProfile from "../../component/popup/popupeditprofile";
import { getUserById } from "../../service/user";

const Profile = () => {
  const navigate = useNavigate();
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const res = await getUserById(user.id);

      const userData =
        res.data?.data?.user || res.data?.data || res.data?.user || res.data;

      setProfile(userData || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {role === "admin" ? <SidebarAdmin /> : <Sidebar />}

      <main className="flex-1 p-8">
        {role === "admin" ? <NavbarAdmin /> : <Navbar />}

        <div className="grid grid-cols-12 gap-8 mt-6">
          {/* ================= LEFT ================= */}
          <div className="col-span-8 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Personal Information</h2>
                <button
                  onClick={() => setOpenEditProfileModal(true)}
                  className="px-4 py-1 rounded-lg bg-[#575757] text-white text-sm"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <Item label="Name" value={profile?.name} />
                <Item label="Username" value={profile?.username} />
                <Item label="Email" value={profile?.email} />
                <Item label="Phone" value={profile?.phone} />
                <Item label="Address" value={profile?.alamat} />
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="col-span-4">
            <div className="bg-white border rounded-2xl p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full mb-4 overflow-hidden bg-gray-200 flex items-center justify-center">
                {profile?.image_url ? (
                  <img
                    src={`http://localhost:3000/${profile.image_url}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-avatar.png"; // fallback kalau image gagal load
                      console.log(
                        "Avatar URL:",
                        `http://localhost:3000/${profile.image_url}`
                      );
                    }}
                  />
                ) : (
                  <span className="text-3xl">👤</span> // fallback emoji kalau user tidak ada foto
                )}
              </div>

              <h3 className="font-semibold text-lg">{profile?.name || "-"}</h3>
              <p className="text-sm text-gray-500 mb-6">
                @{profile?.username || "-"}
              </p>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
      <EditProfile
        open={openEditProfileModal}
        onClose={() => setOpenEditProfileModal(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
};

/* ================= REUSABLE ITEM ================= */
const Item = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right max-w-xs">{value || "-"}</span>
  </div>
);

export default Profile;
