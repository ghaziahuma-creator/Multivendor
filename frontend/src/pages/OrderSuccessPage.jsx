import React from "react";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import animationData from "../Assests/animations/Sucesso.json";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  return (
    <div>
           <DotLottieReact
        data={animationData}
        loop={false}
        autoplay={true}
        style={{ width: 300, height: 300, margin: "0 auto" }}
      />

      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;