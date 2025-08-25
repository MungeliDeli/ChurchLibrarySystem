import React from "react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";

const Footer = ({ className = "" }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  const footerClasses = clsx(
    "py-6 px-6 border-t transition-colors duration-200",
    isDarkMode
      ? "bg-gray-800 border-gray-700 text-gray-300"
      : "bg-white border-gray-200 text-gray-600",
    className
  );

  const linkClasses = clsx(
    "hover:text-blue-600 transition-colors duration-200",
    isDarkMode && "hover:text-blue-400"
  );

  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm">
            <p>© 2024 Church Library Admin. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className={linkClasses}>
              Privacy Policy
            </a>
            <a href="#" className={linkClasses}>
              Terms of Service
            </a>
            <a href="#" className={linkClasses}>
              Support
            </a>
            <a href="#" className={linkClasses}>
              Contact
            </a>
          </div>

          {/* Version */}
          <div className="text-sm text-gray-500">
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
