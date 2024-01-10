/* eslint-disable @next/next/no-img-element */

import PropagateLoader from "react-spinners/PropagateLoader"

const Loading = () => {
  return (
     <div className="bg-[#091B18] h-screen flex flex-col items-center justify-center">
    <div className="flex items-center space-x-2 mb-10">
      <img className="rounded-full h-20 w-20" src="https://i.imgur.com/4h7mAu7.png" alt="" />
      <h1 className="text-lg text-white font-bold">Loading The BlockFolio</h1>
    </div>
    <PropagateLoader color="white" size={30} />
  </div>
  )
}

export default Loading