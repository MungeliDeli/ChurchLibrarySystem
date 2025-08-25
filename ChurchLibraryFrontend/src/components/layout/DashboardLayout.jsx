import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectSidebarCollapsed,
  selectSidebarWidth,
  selectIsDarkMode,
} from "../../store";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import { clsx } from "clsx";

const DashboardLayout = ({ children }) => {
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const sidebarWidth = useSelector(selectSidebarWidth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const layoutClasses = clsx(
    "min-h-screen transition-all duration-300 ease-in-out",
    "bg-gray-50",
    isDarkMode && "bg-gray-900"
  );

  const contentWrapperClasses = clsx(
    "transition-all duration-300 ease-in-out",
    isMobile
      ? "ml-0" // Full width on mobile
      : sidebarCollapsed
      ? `ml-16` // Collapsed sidebar width
      : `ml-${sidebarWidth / 4}` // Full sidebar width (convert px to Tailwind units)
  );

  return (
    <div className={layoutClasses}>
      {/* Desktop Sidebar */}
      <Sidebar isOpen={!sidebarCollapsed && !isMobile} />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content Area */}
      <div className={contentWrapperClasses}>
        <Header />
        <MainContent>{children}</MainContent>
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            /* Close sidebar on mobile */
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
