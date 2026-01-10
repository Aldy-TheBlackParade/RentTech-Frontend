import React, { useEffect, useState } from "react";
import { getUserById, updateUserById } from "../../service/user";

const EditProfile = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ===== Fetch profile setiap kali modal dibuka =====
  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        if (!user?.id) return;

        const res = await getUserById(user.id);
        const userData =
          res.data?.data?.user || res.data?.data || res.data?.user || res.data;

        setForm({
          name: userData?.name || "",
          username: userData?.username || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          address: userData?.alamat || userData?.address || "",
        });

        if (userData?.image_url) {
          setImagePreview(`http://localhost:3000/${userData.image_url}`);
        } else {
          setImagePreview(null);
        }

        setImageFile(null); // reset file saat fetch profile
      } catch (err) {
        console.error("❌ Get profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (!user?.id) return;

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("alamat", form.address);

      if (imageFile) {
        formData.append("image_url", imageFile);
      }

      // ❌ Jangan set Content-Type manual, biar axios atur boundary
      const res = await updateUserById(user.id, formData);

      const updatedUser =
        res.data?.data?.user || res.data?.data || res.data?.user || res.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      handleClose();
      onSuccess?.();
    } catch (err) {
      console.error("❌ Update profile error:", err);
      alert(
        `❌ Gagal update profile: ${
          err.response?.data?.message || "Terjadi kesalahan"
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            Loading profile...
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Edit Profile
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Photo */}
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-28 h-28 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-200 mb-2 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
                <label className="block text-sm text-gray-500 mb-1">
                  Photo Profile
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
              </div>

              {/* Text Inputs */}
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#575757]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border text-gray-600"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-[#575757] text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

/* Reusable Input */
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#575757]"
    />
  </div>
);

export default EditProfile;
