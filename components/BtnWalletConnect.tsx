import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";

import React from "react";

function BtnWalletConnect() {
  return (

    <ThirdwebProvider
      activeChain="mumbai"
      clientId="YOUR_CLIENT_ID"      
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        embeddedWallet({
          auth: {
            options: ["email", "google", "apple", "facebook"],
          },
        }),
      ]}
    >
    
      <ConnectWallet theme={"dark"} modalSize={"wide"} />
    </ThirdwebProvider>
  );
}

export default BtnWalletConnect;
