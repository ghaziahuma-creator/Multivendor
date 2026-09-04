import React from 'react'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllRefunds from "../../components/Shop/AllRefunds.jsx"
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader.jsx'
const ShopAllRefunds = () => {
  return (
     <div>
        <DashboardHeader/>
        <div className='flex justify-between w-full'>
           <div className='w-[80px] 800px:w-[330px] '>
             <DashboardSideBar active={10}/>
           </div>
           <div className='w-full justify-center flex'>
              <AllRefunds/>
           </div>
        </div>
    </div>
  )
}

export default ShopAllRefunds