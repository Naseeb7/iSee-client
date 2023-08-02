import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const Message = ({ socket, userId, peer }) => {
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")
    const [file, setFile] = useState()
    const inputRef=useRef()

    const name = useSelector((state) => state.name)
    useEffect(() => {
        setMessages([])
        socket.off("messagereceived")
        socket.on("messagereceived", (data) => {
            if (data.type === "image") {
                // let src = ""
                const blob = new Blob([data.file], { type: data.mimeType })
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    setMessages((prev) => [...prev, {
                        to: data.to,
                        message: data.message,
                        file: reader.result,
                        type: data.type,
                        mimeType: data.mimeType,
                        fromSelf: false
                    }])
                    // src = reader.result
                }

            } else {
                setMessages((prev) => [...prev, {
                    to: data.to,
                    message: data.message,
                    type: data.type,
                    fromSelf: false
                }])
            }
        })

    }, [userId])

    const sendMessage = () => {
        if (file) {
            const messageObj = {
                to: userId,
                message: text,
                file: file,
                type: "image",
                mimeType: file.type,
            }
            socket.off("messagesent")
            socket.emit("messagesent", messageObj)
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setMessages((prev) => [...prev, {
                    to: userId,
                    message: text,
                    file: reader.result,
                    type: "image",
                    mimeType: file.type,
                    fromSelf: true
                }])
            }
            setFile()
            setText("")
            inputRef.current.value=null;

        } else {
            const messageObj = {
                to: userId,
                message: text,
                type: "text"
            }
            socket.off("messagesent")
            socket.emit("messagesent", messageObj)
            setMessages((prev) => [...prev, {
                to: userId,
                message: text,
                type: "text",
                fromSelf: true
            }])
            setText("")
        }
        // socket.emit("messagesent", { to: userId, message: text })
        // setMessages((prev) => [...prev, { message: text, fromSelf: true }])
    }
    return (
        <div className='flex flex-col bg-slate-500'>
            {messages.map((message) => {
                return <div className="flex w-full">
                    {message.fromSelf ? (
                        <div className="flex w-full justify-end">
                            {message.type === "image" ? (
                                <div className='flex justify-end'>
                                    <img className='flex w-2/4' src={message.file} alt="sent" />
                                    <div>{message.message}</div>
                                </div>
                            ) : (
                                <div>{message.message}</div>
                            )}
                        </div>
                    ) : (
                        <div className="flex w-full justify-start">
                            {message.type === "image" ? (
                            <div>
                                    <img className='flex w-2/4' src={message.file} alt="received " />
                                    <div>{message.message}</div>
                                </div>
                            ) : (
                                <div>{message.message}</div>
                            )}
                        </div>
                    )}
                </div>
            })}
            {/* {src && <img src={src} alt="Sent" />} */}
            <input value={text} type="text" onChange={(e) => setText(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            <input ref={inputRef} type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={() => console.log(messages)}>Messages</button>
        </div>
    )
}

export default Message
