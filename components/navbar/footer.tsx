"use client";

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-800 dark:bg-[#0D1B2A] text-white px-6 md:px-16 pt-12 pb-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
        {/* Our Company */}
        <div>
          <h3 className="font-semibold mb-4">{t("company")}</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{t("vision")}</li>
            <li>{t("mission")}</li>
            <li>{t("goals")}</li>
            <li>{t("originality")}</li>
            <li>{t("recruiting")}</li>
            <li>{t("contact")}</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">{t("support")}</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{t("marketplace")}</li>
            <li>{t("rentalAgency")}</li>
            <li>{t("travelAgency")}</li>
            <li>{t("carpooling")}</li>
          </ul>
        </div>

        {/* Legal Information */}
        <div>
          <h3 className="font-semibold mb-4">{t("legal")}</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{t("terms")}</li>
            <li>{t("privacy")}</li>
            <li>{t("personalInfo")}</li>
            <li>{t("cookies")}</li>
          </ul>
        </div>

        {/* Mobile App */}
        <div>
          <h3 className="font-semibold mb-4">{t("mobileApp")}</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <span role="img" aria-label="apple">🍎</span> {t("appStore")}
            </li>
            <li>
              <span role="img" aria-label="google">▶️</span> {t("playStore")}
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-4">{t("followUs")}</h3>
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
      <div className="text-center text-sm text-gray-400">{t("rights")}</div>
    </footer>
  );
};

export default Footer;
