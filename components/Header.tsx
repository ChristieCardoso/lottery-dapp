import React from "react";
import { NavButton } from "../components/NabButton";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import BtnWalletConnect from "./BtnWalletConnect";

export const Header = () => {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
      <div className="flex items-center space-x-2">
        <img
          className="rounded-full h-20 w-20"
          src="https://res.cloudinary.com/dmvm1mlgv/image/upload/f_auto,q_auto/yhfzhawy4hlzaqjhy5lk"
          alt=""
        />
        <div>
          <h1 className="text-lg text-white font-bold">BlockFolio</h1>
          <p className="text-xs text-emerald-500 truncate">
            User: {address?.substring(0, 5)}...
            {address?.substring(address.length, address.length - 5)}
          </p>
        </div>
      </div>

      <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
        <div className="bg-[#0A1F1C] p-4 space-x-2">
          <NavButton isActive title="Buy Tickets" />
          <NavButton onClick={disconnect} title="Logout" />
        </div>
      </div>

      <div className="flex flex-col ml-auto text-right">
        <BtnWalletConnect />
        <span className="md:hidden">
          <NavButton onClick={disconnect} title="Logout" />
        </span>
      </div>
    </header>
  );
};
