import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsersAdmin } from '../../redux/actions/user';
import { DataGrid } from '@mui/x-data-grid';
import { server } from '../../server';
import {toast} from "react-toastify";
import { RxCross1 } from 'react-icons/rx';
import styles from '../../styles/styles';
import axios from 'axios';
import { getAllSellers } from '../../redux/actions/sellers';

const AllSellers = () => {
  
     const {sellers} = useSelector((state)=> state.seller);
     const dispatch = useDispatch();
     const [open, setOpen]= useState(false);
     const [sellerId, setSellerId]= useState("");;
     useEffect(()=>{
       dispatch(getAllSellers());
     },[dispatch])

     const handleDelete = async (id)=>{
      console.log(id);
         await axios.delete(`${server}/shop/delete-seller/${id}`, {withCredentials: true}).then((res)=>{
        toast.success(res.data.message);
      }).catch((error)=>{
        toast.error(error);
      })
      
      dispatch(getAllSellers());
    }

      const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
       {
      field: "role",
      headerName: "Seller role",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "preview",
      flex: 1,
      minWidth: 150,
      headerName: "Preview Shop",
      type: "text",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/shop/preview/${params.id}`}>
              <Button>
                 <AiOutlineEye size={25}/>
              </Button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
              <Button onClick={()=> setSellerId(params.id) || setOpen(true)}>
                 <AiOutlineDelete size={25}/>
              </Button>
          </>
        );
      },
    },
  ];

  const row = [];

      sellers && sellers.forEach((item)=>{
      row.push({
        id: item?._id,
        name: item?.name ,
        email: item?.email,
        role: item.role,
        joinedAt: item?.createdAt.slice(0,10),
      })
 })
  return (
    <div className='w-full flex justify center pt-5'>
    <div className='w-[95%]'>
        <h3 className="text-[22px] font-Poppins pl-9">All Users</h3>
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
              {
                open && (
                  <div className='w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen'>
                    <div className='w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5'>
                      <div className='w-full flex  justify-end cursor-pointer'>
                         <RxCross1 size={25} onClick={()=> setOpen(false)}/>
                      </div>
                        <h3 className='text-[25px] text-center py-5 font-Poppins text-[#000000cb]' >Aye you sure you wanna delete this seller?</h3>
                        <div className='w-full flex items-center justify-center' >
                           <div className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`} onClick={()=> setOpen(false)}>
                              cancel
                           </div>
                           <div className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}  onClick={()=> setOpen(false) || handleDelete(setSellerId)}>
                              confirm
                           </div>
                        </div>
                    </div>
                  </div>
                )
              }
            </div>
    </div>
    </div>
  )
}

export default AllSellers