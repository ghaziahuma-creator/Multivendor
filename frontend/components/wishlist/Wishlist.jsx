import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import{BsCartPlus} from "react-icons/bs"
import styles from "../../src/styles/styles";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../src/server";
import { removeFromWishlist } from "../../src/redux/actions/wishlist";
import { addToCart } from "../../src/redux/actions/cart";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const {wishlist} = useSelector((state)=> state.wishlist);
   const {cart} = useSelector((state)=> state.cart);
  const dispatch = useDispatch();

    const removeFromWishlistHandler = (data) => {
      dispatch(removeFromWishlist(data));
    };

      const addToCartHandler= (data)=>{
         const isItemExists = cart && cart.find((i)=> i._id === data._id);
         if(isItemExists){
          toast.error("Item already in cart!")
         }else{
             if(data.stock < 1){
              toast.error("Product stock limited!");
             }else{
             const cartData = {...data, qty: 1}
             dispatch(addToCart(cartData));
          toast.success("Item aded to cart successfully!");
             } 
             setOpenWishlist(false);
         }
        }

  return (
     <div className="fixed top-0 left-0 w-full bg-[#0000002c] h-screen z-10">
      <div className="fixed top-0 right-0 h-full 800px:w-[25%] w-[80%] overflow-y-scroll bg-white flex flex-col justify-between shadow-sm">
        {
          wishlist && wishlist.length === 0 ? (
               <div className="w-full h-screen flex items-center justify-center">
                            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                             <RxCross1
                             size={25}
                             className="cursor-pointer"
                             onClick={()=> setOpenWishlist(false)}
                             />
                            </div>
                            Wishlist is empty!
                          </div>
          ):(
           <>
               <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/* Items length */}
          <div className={`${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500] ">{wishlist.length} items</h5>
          </div>

          {/* cart Single Items */}
          <br />
          <div className="w-full border-t">
            {wishlist &&
              wishlist.map((i, index) => <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />)}
          </div>
        </div>
           </> 
          )
        }
      
        
      </div>
    </div>
  )
}

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler  }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;
  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex items-center">
        <RxCross1 onClick={() => removeFromWishlistHandler(data)} className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-6 ml-2"/>
        <img
        src={`${backend_url}${data && data.images[0]}`}
        alt="" 
        className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

          <div className="pl-[5px]">
            <h1>{data.name}</h1>
            <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px]  text-[#f40707de] font-Roboto">US${data.discountPrice}</h4>
        </div>
        <div>
            <BsCartPlus
            size={20}
            className="cursor-pointer ml-4 "
            title="Add to cart"
            onClick={()=>addToCartHandler(data)}
            />
        </div>
      </div>
    </div>
  );
};

export default Wishlist