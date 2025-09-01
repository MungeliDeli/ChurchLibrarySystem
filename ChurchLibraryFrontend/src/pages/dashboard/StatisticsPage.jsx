import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const StatisticsPage = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            This is the Statistics page
          </h1>
          <p className="text-lg text-gray-600">
            Statistics and analytics content will be implemented here
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
