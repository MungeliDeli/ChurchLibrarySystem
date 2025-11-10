import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--color-primary-text)] mb-4">
            This is the Dashboard page
          </h1>
          <p className="text-lg text-[var(--color-secondary-text)]">
            Dashboard content will be implemented here
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
