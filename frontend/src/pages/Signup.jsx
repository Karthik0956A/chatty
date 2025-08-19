import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import {showToast} from "../lib/toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { isSigningUp, signup } = useAuthStore();

  const verifyInput = (e) => {
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!fullname || !email || !password) {
      showToast("Please fill in all fields", "error");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return false;
    }

    // Add more validation as needed
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyInput(e)) {
      const formData = {
        fullname: e.target.fullname.value,
        email: e.target.email.value,
        password: e.target.password.value,
      };
      signup(formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 px-4">
      <form onSubmit={handleSubmit} className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Welcome */}
        <h1 className="text-3xl font-bold text-blue-400 mb-2 text-center">Create Account</h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Join now and start chatting with your friends instantly.
        </p>

        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 pr-10 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        
        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {isSigningUp ? <span className="text-gray-200">Signing Up...</span> : <span className="text-gray-200">Sign Up</span>}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-gray-400 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Log In
        </a>
      </p>
    </div>
  );
}
