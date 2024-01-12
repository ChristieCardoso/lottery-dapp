import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useContractRead , useContract ,useContractWrite} from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import toast from "react-hot-toast";
import { currency } from '../constants';

function AdminControls() {
    const { contract } = useContract("0x343190145eBF5Ad6E10181CcaCf2b2099BfBF617");
    const { data: totalCommission } = useContractRead(contract, "operatorTotalCommission")
    const { mutateAsync: DrawWinnerTicket} = useContractWrite(contract, "DrawWinnerTicket");
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll");
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission");

    
    const clickDrawWinner = async () => {
        const notification = toast.loading("Picking a Lucky Winner ...");
    
        try {
          const data = await DrawWinnerTicket( {args: []});
          toast.success("Winner Selected Successfully!" , {
            id: notification,
          });
    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.log("Contract Call Failure: ", err);
        };
      }

      const onWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing Commission ...");
    
        try {
          const data = await WithdrawCommission( {args: []});

          toast.success("Withdraw Successfully!" , {
            id: notification,
          });
          console.info("contract call success", data);    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.error("Contract Call Failure: ", err);
        };
      }

      const onRestartDraw = async () => {
        const notification = toast.loading("Restart Lottery ...");
    
        try {
          const data = await restartDraw( {args: []});

          toast.success("Lottery Restarted", {
            id: notification,
          });
          console.info("contract call successfully", data);    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.error("Contract Call Failure: ", err);
        };
      }

      const onRefundAll = async () => {  
        const notification = toast.loading("Refunding Tickets ...");
        
        try {
          const data = await RefundAll( {args: []});
          
          toast.success("Refund Successfull!" , {
            id: notification,
          });
          console.info("contract call success!", data);    
        } catch (err) {
          toast.error("Whoops Something went wrong!", {
            id: notification,
          })
          console.error("Contract Call Failure: ", err);
        };
      }
  
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