"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
          // Store the token and user data
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect based on role
          if (data.user.role === "staff") {
              router.push("/staff/dashboard");
          } else {
              router.push("/submission");
          }
      } else {
        setError(data.detail || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSignInAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A2540]">Welcome Back</h1>
            <p className="text-sm text-zinc-500 mt-2">Login to manage your abstract submissions</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-zinc-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-zinc-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#0A2540]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-zinc-600">
                <input type="checkbox" className="mr-2 rounded text-[#0A2540] focus:ring-[#0A2540]" />
                Remember me
              </label>
              <a href="#" className="text-sm font-semibold text-[#0A2540] hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0A2540] text-white py-3 rounded-lg font-bold hover:bg-[#143b66] transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Login <FaSignInAlt />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-[#0A2540] hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}