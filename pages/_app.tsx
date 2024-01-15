import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId="eb07fa0b262c78817642cf5c3989ba18"
    >
      <Component {...pageProps} />
      <Toaster />
    </ThirdwebProvider>
  );
  
}


export default MyApp;
