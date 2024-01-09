/* eslint-disable @next/next/no-img-element */

import React from "react";
import BtnWalletConnect from "./BtnWalletConnect";


function Login() {


  return (
    <div className="bg-[#091818] min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-56 w-56 mb-10"
          src="https://i.imgur.com/4h7mAu7.png"
          alt=""
        />
        <h1 className="text-6xl text-white font-bold">BlockFolio</h1>
        <h3 className="text-white">
          Get Started By Logging in with your MetaMask
        </h3>
      </div>

      <BtnWalletConnect />
    </div>
  );
}

export default Login;
