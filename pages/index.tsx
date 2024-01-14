import { NextPage } from "next";
import Head from "next/head";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import { Header } from "../components/Header";
import Login from "../components/Login";
import Loading from "../components/Loading";
import CountdownTimer from "../components/CountdownTimer";
import AdminControls from "../components/AdminControls";


const Home: NextPage = () => {
  // Obtém o contrato e um indicador de carregamento usando o hook useContract
  const { contract, isLoading } = useContract("0x4c96dc3F2fDFC011941fF043EbE41bC1493e8086");
  // Obtém o endereço atual usando o hook useAddress
  const address = useAddress();
  // Inicializa um estado de quantidade com o valor padrão de 1
  const [quantity, setQuantity] = useState<number>(1);
  // Inicializa um estado de bilhetes do usuário com o valor padrão de 0
  const [userTickets, setUserTickets] = useState(0);
  // Usa o hook useContractRead para obter os dados dos bilhetes do contrato
  const { data: tickets } = useContractRead(contract, "getTickets");
  // Usa o hook useContractRead para obter o preço do bilhete do contrato
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  // Usa o hook useContractRead para obter a data de expiração do contrato
  const { data: expiration } = useContractRead(contract, "expiration");
  // Usa o hook useContractRead para obter os ganhos do contrato para um determinado endereço
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", [address]);
  // Usa o hook useContractWrite para realizar uma mutação assíncrona para retirar os ganhos
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");
  // Usa o hook useContractRead para obter o último vencedor do contrato
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  // Usa o hook useContractRead para obter o valor do último prêmio do contrato
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount");
  // Usa o hook useContractRead para obter o operador da loteria do contrato
  const { data: lotteryOperator } = useContractRead(contract, "lotteryOperator");
  // Usa o hook useContractRead para obter os bilhetes restantes do contrato
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
  // Usa o hook useContractRead para obter a recompensa atual do contrato
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  // Usa o hook useContractRead para obter a comissão do bilhete do contrato
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");


  useEffect(() => {
    // Verifica se os dados dos bilhetes e o endereço estão definidos antes de prosseguir
    if (!tickets) return;
    // Converte os dados dos bilhetes para o tipo string[]
    const totalTickets: string[] = tickets;
    // Calcula o número de bilhetes do usuário usando o endereço
    const numofTickets = totalTickets.reduce(
      (total, ticketAddress) =>
       (ticketAddress === address ? total + 1 : total),
      0
    );
    // Atualiza o estado userTickets com o número de bilhetes do usuário
    setUserTickets(numofTickets);
  }, [tickets, address]);
  
  const handleClick = async () => {
    // Verifica se o preço do bilhete está definido antes de prosseguir
    if (!ticketPrice) return;
    // Converte a data de expiração em um objeto Date
    const expirationTime = new Date(expiration * 1000);
    const nowTime = new Date();
    const notification = toast.loading("Buying your tickets...");
  
    // Verifica se o tempo de expiração é anterior ao tempo atual
    if (expirationTime < nowTime) {
      // Exibe uma mensagem de erro se as vendas de bilhetes estiverem encerradas
      toast.error("Ticket Sales are Closed!", {
        id: notification,
      });
      return;
    }
  
    // Verifica se o usuário atingiu o limite de 10 bilhetes
    if (userTickets === 10) {
      // Exibe uma mensagem de erro se o limite de bilhetes for atingido
      toast.error("Ticket Limit Reached!", {
        id: notification,
      });
      return;
    }
  
    try {
      if (contract) {
        // Realiza a chamada do contrato para comprar bilhetes
        const data = await contract.call("BuyTickets", newFunction(), {
          value: ethers.utils.parseEther(
            (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
          ),
        });
  
        // Exibe uma mensagem de sucesso após a compra bem-sucedida
        toast.success("Ticket Purchased successfully!", {
          id: notification,
        });
        console.info("contract call successs", data);
  
        // Atualize o estado userTickets após a compra bem-sucedida
        setUserTickets(prevUserTickets => prevUserTickets + quantity);
      } else {
        // Tratamento caso contract seja indefinido
        toast.error("Contract is not defined", {
          id: notification,
        });
      }
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na compra de bilhetes
      toast.error("Ticket Purchase Failed!", {
        id: notification,
      });
      console.error("contract call failure", err);
    }
  
    function newFunction(): any[] | undefined {
      return ([]);
    }
  };
  
  const onWithdrawWinnings = async () => {
    // Exibe uma notificação de carregamento ao iniciar a retirada dos ganhos
    const notification = toast.loading("Withdrawing winnings ...");
  
    try {
      // Chama a função para retirar os ganhos do contrato
      const data = await WithdrawWinnings({ args: [] });
  
      // Exibe uma mensagem de sucesso após a retirada bem-sucedida dos ganhos
      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na retirada dos ganhos
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
    }
  };
  
  // Retorna o componente Login se o endereço não estiver definido
  if (!address) return <Login />;
  // Retorna o componente Loading se houver carregamento em andamento
  if (isLoading) return <Loading />;

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
      </Head>

      <div className="flex-1">
        <Header />

        <Marquee className="bg-[#0A1F1C] px-5 mb-5" gradient={false} speed={100} >
          <div className="flex space-x-5 mx-10">
            <h4 className="text-white font-bold">Last Winner: {lastWinner?.toString()}</h4>
            <h4 className="text-white font-bold">Previous Winnings:{" "} {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
          </div>
        </Marquee>

        {lotteryOperator == address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}

        {winnings > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={onWithdrawWinnings}
              className="p-5 bg-gradient-to-b from-orange-600 to bg-emerald-700 animate-bounce text-center rounded-xl w-full text-black"
            >
              <p className="font-bold">Congratulations You Won The Lottery</p>
              <p>
                Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}
              </p>
              <br />
              <p className="font-semibold">Click here to withdraw</p>
            </button>
          </div>
        )}

        {/* The Next Draw Box*/}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
          <div className="stats-container">
            <h1 className="text-5x1 text-white font-semibold text-center">
              {" "}
              The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remainig</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>

            {/* Cointdown timer */}
            <div className="mt-5 mb-3">
              <CountdownTimer />
            </div>
          </div>

          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2 className="">Price per Ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}
                  {""} {currency}
                </p>
              </div>

              <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}
                    {""} {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(ticketCommission?.toString())}
                    {""} {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              
              <button
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toString() === 0
                }
                className="mt-5 w-full bg-gradient-to-br font-semibold from-orange-500 to bg-emerald-600
              py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-100
              "
                onClick={handleClick}
              >
                Buy {quantity} tickets for {" "}
                {ticketPrice && 
                  Number(ethers.utils.formatEther(ticketPrice.toString
                  ())) *
                    quantity}{" "}
                {currency}
              </button>           
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="text-lg mb-3 flex justify-center">
                  You have {userTickets} Tickets in this Lottery{" "}
                </p>

                <div className="flex max-w-sm  gap-x-5 gap-y-2 flex-wrap justify-center">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30 
                    rounded-lg flex flex-shrink-0 items-center justify-center text-xl italic"
                      >
                        {" "}
                        {index + 1}{" "}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
