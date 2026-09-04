import React, { useEffect, useState } from 'react'
import styles from "../../src/styles/styles";
import { productData } from "../../src/static/data";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";

const FeaturedProduct = () => {
      const [data, setData] = useState([]);
   const {allProducts} = useSelector((state) => state.products);
   useEffect(()=>{
         const allProductsData= allProducts ? [...allProducts]: [];
         const sortedData= allProductsData && allProductsData.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
       const firstTen =sortedData &&  sortedData?.slice(0,10);
       setData(firstTen);
      },[allProducts])
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[30px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px]  mb-12 rounded-0 ">
            { data && data.length !== 0 &&
              (
               <>
            {
                data && data.map((i,index)=><ProductCard data={i} key={index}/>)
            }
               </>
               )
            }
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
