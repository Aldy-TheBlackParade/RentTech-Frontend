import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../service/auth";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // State untuk kontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan Confirm Password tidak sama");
      return;
    }

    try {
      const { data } = await registerUser({ name, username, email, password });
      if (data.status) {
        alert("Register Success");
        navigate("/login");
      } else {
        setError(data.message || "Register gagal");
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
          Create Account
        </h1>
        <p className="text-center text-sm text-[#575757] mb-8">
          Register to get started
        </p>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* ... Input Name, Username, Email tetap sama ... */}
          <div>
            <label className="block text-sm text-[#575757] mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-[#575757] mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-[#575757] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm text-[#575757] mb-1">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md
                           text-[#575757] hover:text-black hover:bg-black/5 
                           active:scale-90 transition-all duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm text-[#575757] mb-1">
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-12 rounded-lg bg-transparent border border-[#575757] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#575757] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md
                           text-[#575757] hover:text-black hover:bg-black/5 
                           active:scale-90 transition-all duration-200 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-2 rounded-lg bg-[#575757] text-gray-200 font-medium 
            hover:bg-black hover:text-white active:scale-[0.98] 
            transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-[#575757] mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#338CF4] hover:text-blue-600 transition underline-offset-4 hover:underline bg-transparent p-0"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
