import React, { useEffect } from 'react'
import AdminHeader from "../components/Admin/Layout/AdminHeader";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { getAllOrdersOfAdmin } from '../redux/actions/order';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';

const AdminDashboardOrders = () => {
    const dispatch = useDispatch();

  const{adminOrders, isLoading} = useSelector((state)=> state.order);
  
  useEffect(()=>{
    dispatch(getAllOrdersOfAdmin());    
  },[dispatch])
 
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered"
          ? "greenColor"
          : "redColor"
            ? "greenColor"
            : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "CreatedAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    
  ];

  const row = [];

      adminOrders && adminOrders.forEach((item)=>{
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item)=> acc + item.qty, 0),
        total: item?.totalPrice + "$" ,
        status: item?.status,
        CreatedAt: item?.createdAt.slice(0,10),
      })
 })
  return (
  <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSidebar active={2} />
          </div>
          <div className='w-full flex justify center pt-5'>
              <div className='w-[95%]'>
                  <h3 className="text-[22px] font-Poppins pl-9">All Orders</h3>
                      <div className="w-full min-h-[45vh] bg-white rounded">
                        <div className="w-[95%] mx-8 pt-1 mt-10 bg-white">
                          <DataGrid
                            rows={row}
                            columns={columns}
                            pageSize={10}
                            disabledSelectionOnClick
                            autoHeight
                          />
                        </div>
                      
                      </div>
              </div>
              </div>
              
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardOrders