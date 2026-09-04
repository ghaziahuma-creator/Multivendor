import React from "react";
import AdminHeader from "../components/Admin/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain"

const AdmindashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSidebar active={1} />
          </div>
          <AdminDashboardMain/>
        </div>
      </div>
    </div>
  );
};

export default AdmindashboardPage;
