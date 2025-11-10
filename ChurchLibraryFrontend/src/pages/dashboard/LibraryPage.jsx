import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const LibraryPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--color-primary-text)] mb-4">
            This is the Library page
          </h1>
          <p className="text-lg text-[var(--color-secondary-text)]">
            Library management content will be implemented here
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
