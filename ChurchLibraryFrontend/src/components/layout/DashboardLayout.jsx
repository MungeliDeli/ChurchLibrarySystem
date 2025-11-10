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
import MobileMenu from "./MobileMenu";
import { clsx } from "clsx";

const DashboardLayout = ({ children }) => {
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const sidebarWidth = useSelector(selectSidebarWidth);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile (below 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const layoutClasses = clsx(
    "min-h-screen transition-all duration-300 ease-in-out",
    "bg-[var(--color-background)]",
  );

  const contentWrapperClasses = clsx(
    "transition-all duration-300 ease-in-out",
    isMobile
      ? "ml-0" // Full width on mobile
      : "ml-64" // Always give space for sidebar on desktop
  );

  return (
    <div className={layoutClasses}>
      {/* Desktop Sidebar - Always show on desktop, hide on mobile */}
      {!isMobile && <Sidebar isOpen={true} />}

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content Area */}
      <div className={contentWrapperClasses}>
        <Header />
        <MainContent>{children}</MainContent>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => {
            /* Close sidebar on mobile */
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
