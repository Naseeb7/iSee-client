import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Message = ({socket, userId}) => {
    const [messages, setMessages]=useState([])
    const [text, setText]=useState("")

    const name=useSelector((state)=>state.name)
    useEffect(() => {
        setMessages([])
        socket.off("messagereceived")
        socket.on("messagereceived", (data) => {
        setMessages((prev)=> [...prev, { message: data, fromSelf : false }])
        })

    }, [userId])

    const sendMessage = () => {
        socket.emit("messagesent", { to: userId, message: text })
        setMessages((prev)=> [...prev, { message: text, fromSelf : true }])
    }
  return (
    <div className='flex flex-col bg-slate-500'>
        {messages.map((message)=>{
            return <div className="flex w-full">
                {message.fromSelf ? (
                    <div className="flex w-full justify-end">{message.message}</div>
                 ) : (
                    <div className="flex w-full justify-start">{message.message}</div>
        )}
            </div>
        })}
        <input type="text" onChange={(e)=>setText(e.target.value)}/>
      <button onClick={sendMessage}>Message</button>
    </div>
  )
}

export default Message
