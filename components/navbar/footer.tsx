// components/Footer.tsx
"use client";
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa';
import { IoIosArrowUp } from 'react-icons/io';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-[#0D1B2A] text-white px-6 md:px-16 pt-12 pb-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {/* Our Company */}
        <div>
          <h3 className="font-semibold mb-4">Notre Compagnie</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Notre Vision</li>
            <li>Notre Mission</li>
            <li>Nos objectifs</li>
            <li>Notre originalite</li>
            <li>Nous Recrutons</li>
            <li>Informations de contact </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Place de marche</li>
            {/* <li>Our system for connecting travel service customers and providers</li> */}
            <li>Agence de location</li>
            <li>Agence de voyage</li>
            <li>Service de covoiturage</li>
            {/* <li>Pick me up</li> */}
          </ul>
        </div>

        {/* Legal Information */}
        <div>
          <h3 className="font-semibold mb-4">Informations legales</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Conditions generales d'utilisation</li>
            <li>Politique De Confidentialite</li>
            <li>Vos Informations Personnelles</li>
            <li>Cookies</li>
          </ul>
        </div>

        {/* Mobile App */}
        <div>
          <h3 className="font-semibold mb-4">Application Mobile</h3>
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
          <h3 className="font-semibold mb-4">Suivez nous</h3>
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
        © 2024 Ride&Go. <br /> Tous droits conserves
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
