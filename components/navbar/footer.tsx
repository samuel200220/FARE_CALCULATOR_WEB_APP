"use client";

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
  FaApple,
  FaGooglePlay,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-[#0D1B2A] dark:to-gray-950 text-white pt-12 pb-8 relative overflow-hidden">
      {/* Effet de fond */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-violet-900/10"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Our Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-blue-500/30 inline-block">
              {t("company")}
            </h3>
            <ul className="space-y-3">
              {["vision", "mission", "goals", "originality", "recruiting", "contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-blue-500/30 inline-block">
              {t("support")}
            </h3>
            <ul className="space-y-3">
              {["marketplace", "rentalAgency", "travelAgency", "carpooling"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-blue-500/30 inline-block">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              {["terms", "privacy", "personalInfo", "cookies"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile App */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-blue-500/30 inline-block">
              {t("mobileApp")}
            </h3>
            <div className="space-y-4">
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-300 group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:scale-110 transition-transform">
                  <FaApple className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Download on</div>
                  <div className="font-semibold">{t("appStore")}</div>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-300 group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:scale-110 transition-transform">
                  <FaGooglePlay className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Get it on</div>
                  <div className="font-semibold">{t("playStore")}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-blue-500/30 inline-block">
              {t("followUs")}
            </h3>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-6">
              {[
                { icon: <FaTwitter />, color: "hover:text-blue-400", bg: "hover:bg-blue-500/20" },
                { icon: <FaFacebookF />, color: "hover:text-blue-600", bg: "hover:bg-blue-600/20" },
                { icon: <FaInstagram />, color: "hover:text-pink-500", bg: "hover:bg-pink-500/20" },
                { icon: <FaLinkedinIn />, color: "hover:text-blue-500", bg: "hover:bg-blue-500/20" },
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className={`p-3 bg-gray-700/50 rounded-full ${social.color} ${social.bg} transition-all duration-300 hover:scale-110`}
                  aria-label={`Social media ${index}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg">
              <FaGlobe className="text-blue-400" />
              <span className="flex-1">Français</span>
              <span className="text-gray-400">▼</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaPhone className="text-green-400 w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-400 w-4 h-4" />
                <span>contact@entreprise.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom note */}
        <div className="text-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>{t("rights")}</div>
            <div className="flex gap-6 text-xs">
              <a href="#" className="hover:text-white transition-colors">Accessibilité</a>
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Gestion des cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;