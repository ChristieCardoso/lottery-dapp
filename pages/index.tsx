import { NextPage } from "next";
import { Header } from "../components/Header";
import Head from "next/head";
import { useAddress } from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const address = useAddress();
  console.log(address)
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
      </Head>

      <Header />
    </div>
  );
};

export default Home;
