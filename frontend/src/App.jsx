import React, { useEffect } from "react";
import { Routes, Route , Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore.js";

const App = ()=>{
  const { authUser, isCheckingAuth, checkAuth  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div role="status" className="flex items-center justify-center h-screen w-screen">
        <div className="w-10 h-10 bg-white border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
  );
  }



  return(
    <div className="flex flex-col h-screen">
      
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage user={authUser} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <Profile name={authUser.fullname} email={authUser.email} /> : <Navigate to="/login" />} />
      </Routes>
      
    
    </div>
  );
};

export default App;