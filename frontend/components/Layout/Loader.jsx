import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import animationData from "../../src/Assests/animations/Shipping label printing.json";
const Loader = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
          <DotLottieReact
        data={animationData}
        loop={false}
        autoplay={true}
        style={{ width: 300, height: 300, margin: "0 auto" }}
      />
    </div>
  )
}

export default Loader;