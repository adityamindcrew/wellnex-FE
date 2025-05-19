"use client";

import Image from "next/image";
import logo from '../../app/assets/images/logo.png';
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className="flex items-center px-4 md:px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-7 w-28 relative">
            <Image src={logo} alt="WellnexAI Logo" width={200} height={200} />
          </div>
        </div>
        <div className="hidden md:flex items-center ml-auto space-x-6">
          <a href="/landing" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/landing' ? 'border-b-2 border-black' : ''}`}>Home</a>
          <a
            href="/about"
            className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname.startsWith('/about') ? 'border-b-2 border-black' : ''}`}
          >
            About
          </a>
          <a href="/help" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/help' ? 'border-b-2 border-black' : ''}`}>Help</a>
          <a href="/faqs" className={`text-md font-medium text-[#000000] hover:text-[#000000] pb-2 ${pathname === '/faqs' ? 'border-b-2 border-black' : ''}`}>FAQs</a>
          <a href="/signin" className="ml-8 text-black bg-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">Log In</a>
          <a href="/signup" className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium ml-2">Join Now</a>
        </div>
        <button className="md:hidden ml-auto" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 py-3 space-y-3">
            <a href="/landing" className={`block text-md font-medium text-[#000000] hover:text-[#000000] ${pathname === '/landing' ? 'border-b-2 border-black' : ''}`}>Home</a>
            <a href="/about" className={`block text-md font-medium text-[#000000] hover:text-[#000000] ${pathname.startsWith('/about') ? 'border-b-2 border-black' : ''}`}>About</a>
            <a href="/help" className={`block text-md font-medium text-[#000000] hover:text-[#000000] ${pathname === '/help' ? 'border-b-2 border-black' : ''}`}>Help</a>
            <a href="/faqs" className={`block text-md font-medium text-[#000000] hover:text-[#000000] ${pathname === '/faqs' ? 'border-b-2 border-black' : ''}`}>FAQs</a>
          </div>
        </div>
      )}
    </header>
  );
}
