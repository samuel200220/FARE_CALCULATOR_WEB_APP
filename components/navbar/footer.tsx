// components/Footer.tsx
"use client";
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import { IoIosArrowUp } from 'react-icons/io';

const Footer = () => {
  return (
    <footer className="bg-blue-500 dark:bg-blue-900 text-white px-6 md:px-16 pt-12 pb-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {/* Our Company */}
        <div>
          <h3 className="font-semibold mb-4">Our Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Our Vision</li>
            <li>Our Mission</li>
            <li>Our Objectives</li>
            <li>Our Originality</li>
            <li>We Are Hiring</li>
            <li>Contact Information</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Marketplace</li>
            <li>Our system for connecting travel service customers and providers</li>
            <li>Rental Agency</li>
            <li>Travel Agency</li>
            <li>Carpooling Service</li>
            <li>Pick me up</li>
          </ul>
        </div>

        {/* Legal Information */}
        <div>
          <h3 className="font-semibold mb-4">Legal Information</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>General Terms of Use</li>
            <li>Privacy Policy</li>
            <li>Your Personal Information</li>
            <li>Cookies</li>
          </ul>
        </div>

        {/* Mobile App */}
        <div>
          <h3 className="font-semibold mb-4">Mobile App</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <span role="img" aria-label="apple">🍎</span> App Store
            </li>
            <li>
              <span role="img" aria-label="google">▶️</span> Play Store
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-4">Follow us</h3>
          <div className="flex space-x-4 mb-4">
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="hover:text-pink-400 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-500 cursor-pointer" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <FaGlobe />
            <span>Fr</span>
            <span>▼</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 my-4" />

      {/* Bottom note */}
      <div className="text-center text-sm text-gray-400">
        © 2024 Ride&Go. <br /> All rights reserved
      </div>

      {/* Floating Button */}
      {/* <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl shadow-lg z-50"
      >
        <IoIosArrowUp />
      </button> */}
    </footer>
  );
};

export default Footer
