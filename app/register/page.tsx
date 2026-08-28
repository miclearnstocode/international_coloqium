"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaSpinner, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Real-time validation logic
  const isLengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  
  const isFormValid = 
    fullName.trim() !== "" && 
    email.trim() !== "" && 
    isLengthValid && 
    hasUpperCase && 
    hasNumber && 
    doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token and user data
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Show success modal instead of alert
        setShowSuccessModal(true);
        
        // Redirect to login after a delay (3 seconds)
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.detail || data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540] flex flex-col">
      <Header />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-[#0A2540] mb-3">
                Registration Successful!
              </h2>
              
              <p className="text-zinc-600 mb-6">
                Welcome to the 3rd International Agri-Life & Bioresource Science Symposium!
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Hi {fullName.split(' ')[0]}!</span>
                  <br />
                  Your account has been created successfully. You will be redirected to the login page shortly.
                </p>
              </div>
              
              {/* Loading indicator for redirect */}
              <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                <FaSpinner className="animate-spin" />
                Redirecting to login...
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#F5A623] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A2540]">Create Account</h1>
            <p className="text-sm text-zinc-500 mt-2">Join the 3rd International Agri-Life & Bioresource Science Symposium</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-zinc-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Juan Dela Cruz" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-zinc-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="suc@suc.edu.ph" 
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
                  placeholder="Create a strong password" 
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

              {/* Real-time Validation Indicators */}
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-2 text-xs ${isLengthValid ? "text-green-600" : "text-zinc-500"}`}>
                  {isLengthValid ? <FaCheckCircle /> : <FaTimesCircle className="text-zinc-300" />} 
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 text-xs ${hasUpperCase ? "text-green-600" : "text-zinc-500"}`}>
                  {hasUpperCase ? <FaCheckCircle /> : <FaTimesCircle className="text-zinc-300" />} 
                  At least 1 uppercase letter (A-Z)
                </div>
                <div className={`flex items-center gap-2 text-xs ${hasNumber ? "text-green-600" : "text-zinc-500"}`}>
                  {hasNumber ? <FaCheckCircle /> : <FaTimesCircle className="text-zinc-300" />} 
                  At least 1 number (0-9)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-zinc-400" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Re-enter your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#0A2540] focus:ring-1 focus:ring-[#0A2540]"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#0A2540]"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${doPasswordsMatch ? "text-green-600" : "text-red-600"}`}>
                  {doPasswordsMatch ? <FaCheckCircle /> : <FaTimesCircle />} 
                  {doPasswordsMatch ? "Passwords match" : "Passwords do not match"}
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                isFormValid && !loading
                  ? "bg-[#0A2540] text-white hover:bg-[#143b66]" 
                  : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Register <FaUserPlus />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#0A2540] hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}