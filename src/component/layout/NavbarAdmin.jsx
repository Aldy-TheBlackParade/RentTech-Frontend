import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
import { getUserById } from "../../service/user";

const NavbarAdmin = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser?.id) return;

        const res = await getUserById(parsedUser.id);
        const userData =
          res.data?.data?.user || res.data?.data || res.data?.user || res.data;

        setUser(userData);
      } catch (err) {
        console.error("NavbarAdmin fetchUser error:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      setUser(JSON.parse(storedUser));
    };

    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  const handleToggle = () => setOpen(!open);

  const goToProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <header className="flex items-center justify-between mb-8 relative">
      {/* Title */}
      <h1 className="text-2xl font-semibold">
        Admin<span className="text-gray-400">Panel</span>
      </h1>

      <div className="relative">
        {/* Avatar + Name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleToggle}
        >
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            {user?.image_url ? (
              <img
                src={
                  imgError
                    ? "/fallback-avatar.png"
                    : `http://localhost:3000/${user.image_url}`
                }
                alt="avatar"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <UserIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="text-sm font-medium">{user?.name || "Admin"}</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
            <ul className="flex flex-col text-sm">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={goToProfile}
              >
                <UserIcon className="w-5 h-5 text-gray-600" />
                Profile
              </li>

              <li
                className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                ↩ Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarAdmin;
