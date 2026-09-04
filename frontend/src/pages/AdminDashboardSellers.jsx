import React from 'react'
import AdminHeader from "../components/Admin/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllSellers from "../components/Admin/AllSellers"

const AdminDashboardSellers = () => {
  return (
   <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSidebar active={3} />
          </div>
         <AllSellers/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardSellers