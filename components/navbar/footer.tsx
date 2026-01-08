"use client";

import React from "react";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe,
  FaApple, FaGooglePlay, FaPhone, FaEnvelope
} from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 relative overflow-hidden border-t border-white/10">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Company */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white mb-4">{t("company")}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {["vision", "mission", "goals", "originality", "recruiting", "contact"].map((item) => (
                <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{t(item)}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white mb-4">{t("support")}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {["marketplace", "rentalAgency", "travelAgency", "carpooling"].map((item) => (
                <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{t(item)}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white mb-4">{t("legal")}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {["terms", "privacy", "personalInfo", "cookies"].map((item) => (
                <li key={item}><a href="#" className="hover:text-blue-400 transition-colors">{t(item)}</a></li>
              ))}
            </ul>
          </div>

          {/* Apps */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4">{t("mobileApp")}</h3>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                <FaApple className="w-8 h-8" />
                <div>
                  <div className="text-xs text-gray-400">Download on</div>
                  <div className="font-bold text-sm">{t("appStore")}</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                <FaGooglePlay className="w-7 h-7 ml-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="font-bold text-sm">{t("playStore")}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white mb-4">{t("followUs")}</h3>
            <div className="flex gap-4">
              {[FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="space-y-3 text-sm text-gray-400 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3"><FaPhone className="text-blue-500" /> +33 1 23 45 67 89</div>
              <div className="flex items-center gap-3"><FaEnvelope className="text-violet-500" /> contact@farcal.com</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>{t("rights")}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Accessibilité</a>
            <a href="#" className="hover:text-white">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;