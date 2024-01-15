import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useContractRead , useContract ,useContractWrite} from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import toast from "react-hot-toast";
import { currency } from "../libs/constants";

function AdminControls() {
  // Obtém o contrato usando o hook useContract
  const { contract } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
  // Obtém o total da comissão do operador usando o hook useContractRead
  const { data: totalCommission } = useContractRead(contract, "operatorTotalCommission");
  // Obtém a função de mutação para sortear um bilhete vencedor usando o hook useContractWrite
  const { mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket");
  // Obtém a função de mutação para reembolsar todos os bilhetes usando o hook useContractWrite
  const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
  // Obtém a função de mutação para reiniciar o sorteio usando o hook useContractWrite
  const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
  // Obtém a função de mutação para retirar a comissão usando o hook useContractWrite
  const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");

  // Define a função assíncrona que lida com o clique para sortear um vencedor
  const clickDrawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner ...");

    try {
      const data = await DrawWinnerTicket( {args: []});
      // Exibe uma mensagem de sucesso após a seleção do vencedor
      toast.success("Winner Selected Successfully!" , {
        id: notification,
      });
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na chamada do contrato
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
      console.log("Contract Call Failure: ", err);
    }
  };

  // Define a função assíncrona que lida com a retirada da comissão
  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission ...");

    try {
      const data = await WithdrawCommission( {args: []});
      // Exibe uma mensagem de sucesso após a retirada bem-sucedida
      toast.success("Withdraw Successfully!" , {
        id: notification,
      });
      console.info("contract call success", data);    
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na chamada do contrato
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
      console.error("Contract Call Failure: ", err);
    }
  };

  // Define a função assíncrona que lida com o reinício do sorteio
  const onRestartDraw = async () => {
    const notification = toast.loading("Restart Lottery ...");

    try {
      const data = await restartDraw( {args: []});
      // Exibe uma mensagem de sucesso após o reinício bem-sucedido
      toast.success("Lottery Restarted", {
        id: notification,
      });
      console.info("contract call successfully", data);    
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na chamada do contrato
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
      console.error("Contract Call Failure: ", err);
    }
  };

  // Define a função assíncrona que lida com o reembolso de todos os bilhetes
  const onRefundAll = async () => {  
    const notification = toast.loading("Refunding Tickets ...");
    
    try {
      const data = await RefundAll( {args: []});
      // Exibe uma mensagem de sucesso após o reembolso bem-sucedido
      toast.success("Refund Successfull!" , {
        id: notification,
      });
      console.info("contract call success!", data);    
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha na chamada do contrato
      toast.error("Whoops Something went wrong!", {
        id: notification,
      });
      console.error("Contract Call Failure: ", err);
    }
  };
  
  return (
    <div className='text-white text-center mt-5 px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>Admin Controls</h2>
        <p className='mb-5'>
          Total Commission to be withdrawn:{" "} 
          {totalCommission && 
            ethers.utils.formatEther(totalCommission.toString())}{" "}
          {currency}</p>
    
        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={clickDrawWinner} className='admin-button'>
                <StarIcon className='h-6 mx-auto mb-2' />
                Draw Winner
            </button>
            <button onClick={onWithdrawCommission} className='admin-button'>
                <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
                Withdraw Commission
            </button>
            <button onClick={onRestartDraw} className='admin-button'>
                <ArrowPathIcon className='h-6 mx-auto mb-2' />
                Restart Draw
            </button>
            <button onClick={onRefundAll} className='admin-button'>
                <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                Refund ALL
            </button>
        </div>
    </div>
  )
}

export default AdminControls