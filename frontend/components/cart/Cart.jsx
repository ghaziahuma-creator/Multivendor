import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import styles from "../../src/styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../src/server";
import { addToCart, removeFromCart } from "../../src/redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) =>acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = ((data)=>{
    dispatch(addToCart(data));
  })

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000002c] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[80%] 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
       {
         cart && cart.length===0? (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
               <RxCross1
               size={25}
               className="cursor-pointer"
               onClick={()=> setOpenCart(false)}
               />
              </div>
              Cart items is empty!
            </div>
         ):(
          <>
           <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenCart(false)}
            />
          </div>
          {/* Items length */}
          <div className={`${styles.normalFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-[20px] font-[500] ">
              {cart.length} items
            </h5>
          </div>

          {/* cart Single Items */}
          <br />
          <div className="w-full border-t">
            {cart &&
              cart.map((i, index) => <CartSingle key={index} data={i} quantityChangeHandler={quantityChangeHandler} removeFromCartHandler={removeFromCartHandler} />)}
          </div>
        </div>
        <div className="px-5 mb-3">
          {/* Checkout buttons */}
          <Link to="/checkout">
            <div
              className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
            >
              <h1 className="text-[#fff] text-[18px] font-[600] ">
                Checkout Now (USD${totalPrice})
              </h1>
            </div>
          </Link>
        </div>
          </>
         )
       }
      </div>
    </div>
  );
};

const CartSingle = ({ data , quantityChangeHandler, removeFromCartHandler}) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;
  const incremant = (data) => {
    console.log(data.stock)
    if(data.stock < value+1){
       toast.error("Item stock is limited!")
    }else{
       setValue(value + 1);
    const updateCartData = { ...data, qty: value + 1 };
    quantityChangeHandler(updateCartData)
    }
  };

  const decremant = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData)
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#d80a0adb] rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer `}
            onClick={() => incremant(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px] ">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer "
            onClick={() => decremant(data)}
          >
            <HiOutlineMinus size={16} color="#70879c" />
          </div>
        </div>
        <img
          src={`${backend_url}${data.images && data.images[0]}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.discountPrice}*{value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px  text-[#f40707de] font-Roboto">
            US $ {totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};
export default Cart;
