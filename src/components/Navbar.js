import React, { useEffect } from 'react'
import { io } from "socket.io-client";

const baseURL=process.env.REACT_APP_BASE_URL

const Navbar = () => {

  useEffect(()=>{
    const socket = io(baseURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
    });
  socket.on("myid", (data)=>{
    console.log(data)
  })
  },[])

  return (
    <div className='flex justify-center bg-slate-200 p-2 border-2'>
      <div className="flex px-2 text-3xl font-bold text-teal-600">iSee</div>
    </div>
  )
}

export default Navbar
