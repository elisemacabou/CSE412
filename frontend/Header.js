import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, handleLogout, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Trigger search on button click
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery); // Call the search function passed from App.js
    }
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      {/* Left Section: Brand Name */}
      <div className="flex items-center">
        <button className="mr-4">
          <span className="text-2xl">☰</span> {/* Menu Icon */}
        </button>
        <Link to="/" className="text-xl font-bold text-gray-800 hover:underline">
          EstateFinder
        </Link>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter a city"
          className="border rounded-full px-4 py-2 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearchClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Search
        </button>
      </div>

      {/* Right Section: User Login/Logout */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-black text-white rounded-full px-4 py-2 font-medium hover:bg-gray-800"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 font-medium hover:underline">
              Log in
            </Link>
            <Link
              to="/create-account"
              className="bg-black text-white rounded-full px-4 py-2 font-medium hover:bg-gray-800"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;