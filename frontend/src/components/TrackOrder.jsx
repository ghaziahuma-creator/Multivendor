import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { useEffect } from "react";

const TrackOrder = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id == id);
  console.log(data);
  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <>
        {data && data?.status === "Processing" ? (
          <h1 className="text-[20px]">Your order is processing in the shop.</h1>
        ) : data?.status === "Transfered to delivery partner" ? (
          <h1 className="text-[20px]">
            Your order is on the way for delivery partner.
          </h1>
        ) : data?.status === "Shipping" ? (
          <h1 className="text-[20px]">
            Your order is on the way to your city.
          </h1>
        ) : data?.status === "Received" ? (
          <h1 className="text-[20px]">
            Your order has reached the destination city .
          </h1>
        ) : data?.status === "On the way" ? (
          <h1 className="text-[20px]">Your order is out for delivery.</h1>
        ) : data?.status === "Delivered" ? (
          <h1 className="text-[20px]">Your order is delivered!</h1>
        ) : data?.status === "Processing refund" ? (
          <h1 className="text-[20px]">Your refund is processsing!</h1>
        ) : data?.status === "Processing Success" ? (
          <h1 className="text-[20px]">Your refund is success!</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
