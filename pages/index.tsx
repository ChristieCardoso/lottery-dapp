import { NextPage } from "next";
import { Header } from "../components/Header";
import Head from "next/head";

const Home: NextPage = () => {
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
