import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const Navbar = () => {
  const { user, authUser, logout } = useAuthStore();
  return (
    <div className="flex justify-between items-center p-4  text-white">
    <div className='flex opacity-50 cursor-pointer' onClick={() => window.location.href="/"}>
    <img src='https://res.cloudinary.com/dhaaa7yzr/image/upload/v1755500549/vpovgzy13gvwpthco76g.png' alt='Logo' className="h-8 " />
    <span className="text-lg font-semibold">Chatty</span>
    </div>

    <div className='flex opacity-50 text-lg font-semibold cursor-pointer' onClick={() => window.location.href="/profile"}>Profile</div>
    {authUser?
    <div><button className="hover:bg-blue-700 focus:outline-none p-2" onClick={logout} >Log Out</button></div>
    :
    <div></div>
    }
    </div>
  );
};
export default Navbar;
