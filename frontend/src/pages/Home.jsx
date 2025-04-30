import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserDetails, logoutUser } from "../features/authSlice";


const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state)=>state.auth);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  const profile = user.profileImage || "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f464.svg"

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure, You want to Logout')
    if(confirmLogout){
      dispatch(logoutUser()).then(()=>{
        navigate('/login');
      })
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Shopify</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Shop
                </Link>
                <Link
                  to="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Arrivals
                </Link>
                <Link
                  to="/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Latest
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/user-profile"
                    className="flex items-center hover:text-blue-600"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profile}
                      alt="User avatar"
                    />
                    <span className="ml-2 text-sm font-medium">
                      {user.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-grow items-center justify-center ">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Shopify</h1>
      </div>
    </div>
  );
};



export default Home;
