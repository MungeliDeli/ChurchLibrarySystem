import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ActivityLogs from "../../components/common/ActivityLogs";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <ActivityLogs />
    </DashboardLayout>
  );
};

export default DashboardPage;
