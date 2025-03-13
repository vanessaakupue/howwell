'use client'; 
import React, { useState } from 'react';
import Logout from '@/components/Logout';
import DeleteAccount from '@/components/DeleteAccount';

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  return (
    <>
      {/* Hamburger Menu for Small Screens */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-indigo-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Buttons for Larger Screens */}
      <div className="hidden sm:flex items-center gap-4">
        <Logout />
        <DeleteAccount />
      </div>

      {/* Dropdown Menu for Small Screens */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 right-4 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-2">
          <Logout />
          <DeleteAccount />
        </div>
      )}
    </>
  );
}