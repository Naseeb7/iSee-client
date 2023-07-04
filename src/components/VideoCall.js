import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";

const baseURL=process.env.REACT_APP_BASE_URL

const VideoCall = () => {
    const [myId, setMyId]=useState()
  const [userId, setUserId]=useState()
  const socket = useRef()

  useEffect(()=>{
    socket.current = io(baseURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
    });
  socket.current.on("messagereceived", (data)=>{
    console.log(data)
    
  })
  socket.current.on("myid", (data)=>{
    console.log(data)
    setMyId(data)
  })
  
  },[])

  const sendMessage=()=>{
    socket.current.emit("messagesent",{to : userId, message: "Socket message"})
  }
  return (
    <div>
      
    </div>
  )
}

export default VideoCall
