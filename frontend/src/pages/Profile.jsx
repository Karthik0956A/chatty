import { use, useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import instance from "../lib/axios";
import { showToast } from "../lib/toast";

// Default image from assets
import chatIcon from "../assets/profile.png";

const Profile = ({ name, email }) => {
  const { authUser, checkAuth } = useAuthStore();
  const [profilePic, setProfilePic] = useState(authUser?.profilepic || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Handle file upload and update profile pic
  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // File type validation
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    showToast("Invalid file type. Please select a jpeg, png, jpg, or webp image.", "error");
    return;
  }

  // File size validation (max 50KB)
  if (file.size > 50 * 1024) {
    showToast("File too large. Max size is 50KB.", "error");
    return;
  }

  setLoading(true);
  showToast("Uploading profile photo...", "info",3000);

  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const res = await instance.put("/auth/update-pic", { profilepic: base64 });
      setProfilePic(res.data.profilepic);
      showToast("Profile photo updated!", "success");
      checkAuth();
    };
    reader.readAsDataURL(file);
  } catch (err) {
    showToast("Failed to update profile photo.", "error");
  } finally {
    setLoading(false);
  }
};

  // Show either user's profilepic or default asset
  const displayPic = profilePic || chatIcon;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative mb-8">
        {/* Profile Image */}
        <img
          src={displayPic}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover bg-gray-700"
        />
        {/* Camera Icon */}
        <button
          type="button"
          className="absolute bottom-2 right-2 bg-gray-900 border-2 border-blue-500 rounded-full p-2 hover:bg-blue-600 transition"
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
          aria-label="Change profile photo"
        >
          <Camera className="text-white" size={28} />
        </button>
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {/* Full Name */}
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={name}
          disabled
        />
      </div>
      {/* Email */}
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={email}
          disabled
        />
      </div>
    </div>
  );
};

export default Profile;