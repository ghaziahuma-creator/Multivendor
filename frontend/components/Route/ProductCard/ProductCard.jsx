import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../src/styles/styles";
import { AiFillHeart, AiFillStar, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineStar } from "react-icons/ai";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { backend_url } from "../../../src/server"
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist } from "../../../src/redux/actions/wishlist";
import { addToCart } from "../../../src/redux/actions/cart";
import Ratings from "../../../src/components/Products/Ratings";

const ProductCard = ({ data, isShop, isEvent }) => {
  const {cart} = useSelector((state)=> state.cart);
  const {wishlist} = useSelector((state)=> state.wishlist);
  const dispatch = useDispatch()
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

 

   useEffect(()=>{
   if( wishlist && wishlist.find((i)=> i._id === data._id)){
      setClick(true);
    }else{
      setClick(false);
    }
   },[wishlist])
  const id = data._id;

  const addToCartHandler= (id)=>{
     const isItemExists = cart && cart.find((i)=> i._id === id);
     if(isItemExists){
      toast.error("Item already in cart!")
     }else{
         if(data.stock < 1){
          toast.error("Product stock limited!")
         }else{
         const cartData = {...data, qty: 1}
         dispatch(addToCart(cartData));
      toast.success("Item aded to cart successfully!");
         }
     }
    }

  const addToWishlisthandler = (data)=>{
     setClick(!click)
      dispatch(addToWishlist(data));
      toast.success("Item added to wishlist!")
  }

   const removeFromWishlisthandler = (data)=>{
    setClick(!click)
      dispatch(removeFromWishlist(data))
       toast.success("Item removed from wishlist!")
  }

  
  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer ">
        <div className="flex justify-end"></div>
        <Link to={`${isEvent=== true ?`/product/${id}?isEvent=true`:`/product/${data._id}`}`}>
          <img
            src={`${data && data?.images[0]?.url}`}
            alt=""
            className="w-full h-[170px] object-contain  "
          />
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
         <Link to={`${isEvent=== true ?`/product/${id}?isEvent=true`:`/product/${data._id}`}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
          <div className="flex">
           <Ratings rating={data.ratings}/>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discountPrice  ? data.discountPrice + " $" : null}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data.sold_out} sold
            </span>
          </div>
            </Link>

          {/* Side options */}
          <div>
            {click ? (
              <AiFillHeart
                size={22}
                className="cursor-pointer absolute right-2 top-5"
                onClick={() =>removeFromWishlisthandler(data) }
                color={click ? "red" : "#333"}
                title="Remove from Wishlist"
              />
            ) : (
              <AiOutlineHeart
                size={22}
                className="cursor-pointer absolute right-2 top-5"
                onClick={() => addToWishlisthandler(data)}
                color={click ? "red" : "#333"}
                title="Add to Wishlist"
              />
            )}
             <AiOutlineEye
                size={22}
                className="cursor-pointer absolute right-2 top-14"
                onClick={() => setOpen(!open)}
                color= "#333"
                title="Quick view"
              />
              <AiOutlineShoppingCart
                size={25}
                className="cursor-pointer absolute right-2 top-24"
                onClick={() => addToCartHandler(data._id)}
                color= "#333"
                title="Add to cart"
                
              />
              {
                open ? (
                    <ProductDetailsCard  setOpen={setOpen} data={data} />
                ) : null
              }
          </div>
      </div>
    </>
  );
};

export default ProductCard;
