import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";

function Login() {
  return (
    <div className="bg-[#091818] min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-56 w-56 mb-10"
          src="https://res.cloudinary.com/dmvm1mlgv/image/upload/f_auto,q_auto/yhfzhawy4hlzaqjhy5lk"
          alt=""
        />
        <h1 className="text-6xl text-white font-bold">Lottery</h1>
        <h3 className="text-white">
          Get Started By Logging in with your MetaMask
        </h3>
      </div>
      <ConnectWallet btnTitle="Connect Wallet" />
    </div>
  );
}

export default Login;
