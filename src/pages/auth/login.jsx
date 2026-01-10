import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/auth";
import { Eye, EyeOff } from "lucide-react"; // Import icon

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle mata
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Email/Username dan password wajib diisi");
      return;
    }

    try {
      const { data } = await loginUser({ identifier, password });

      if (data.status && data.data?.access_token) {
        localStorage.setItem("accessToken", data.data.access_token);

        const userData = data.data.user || data.data;
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.role === "admin") {
          navigate("/admin/category", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Gagal menghubungi server";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000D9] p-4">
      <div className="w-full max-w-md bg-white/70 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-center text-[#000000] mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-[#575757] mb-8">
          Please login to your account
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Identifier Field */}
          <div>
            <label className="block text-sm text-[#575757] mb-1">
              Email / Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              placeholder="Enter your email or username"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm text-[#575757] mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 p-2 rounded-md text-[#575757] 
                           hover:text-black hover:bg-black/5 
                           active:scale-90 transition-all duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#575757] text-gray-100 font-medium 
                       hover:bg-black hover:text-white active:scale-[0.98] 
                       transition-all duration-200 shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-[#575757] mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#338CF4] font-medium hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
