import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";
import Peer from "simple-peer"
import { setOncall } from '../reducers';
import Message from './Message';
import Avatar, { genConfig } from 'react-nice-avatar'
import Notifications from './Notifications';
import { v4 as uuidv4 } from 'uuid';
import { Phone, PhoneCall, XCircle } from 'lucide-react';

const baseURL = process.env.REACT_APP_BASE_URL

const VideoCall = () => {
    const [myId, setMyId] = useState()
    const [stream, setStream] = useState()
    const [myVideoOn, setMyVideoOn] = useState(true)
    const [mute, setMute] = useState(false)
    const [notifications, setNotifications] = useState([])
    const name = useSelector((state) => state.name)
    const [callerId, setCallerId] = useState()
    const [userSignal, setUserSignal] = useState()
    const [callerName, setCallerName] = useState("")
    const [callerAvatar, setCallerAvatar] = useState()
    const [userId, setUserId] = useState()
    const [userVideoOff, setUserVideoOff] = useState(false)
    const [userName, setUserName] = useState("")
    const [userMute, setUserMute] = useState(false)
    const [userAvatar, setUserAvatar] = useState()
    const [incomingCall, setIncomingCall] = useState(false)
    const onCall = useSelector((state) => state.onCall)
    const dispatch = useDispatch()
    const timeOutRef = useRef()
    const socket = useRef()
    const myStream = useRef({})
    const callerStream = useRef()
    const peerRef = useRef()
    const notificationRef = useRef(0)

    useEffect(() => {
        // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((data) => {
        //     setStream(data);
        //     myStream.current.srcObject = data;
        // })

        socket.current = io(baseURL, {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: Infinity,
        })

        socket.current.off("myid")
        socket.current.on("myid", (data) => {
            setMyId(data)
        })

        socket.current.off("userVideoOff")
        socket.current.on("userVideoOff", (data) => {
            setUserVideoOff(data)
        })

        socket.current.off("userMute")
        socket.current.on("userMute", (data) => {
            setUserMute(data)
        })

        socket.current.off("callEnded")
        socket.current.on("callEnded", (data) => {
            peerRef.current.destroy()
        })

        socket.current.on("on_error",()=>{
            setNotifications((prev) => [...prev, { reason: "Something went wrong! Please reconnect.", id: uuidv4() }])
        })

    }, [])

    const randomID = () => {

    }

    if (socket.current) {
        socket.current.off("userDisconnected")
        socket.current.on("userDisconnected", (data) => {
            if (data === userId) {
                peerRef.current.destroy()
                setNotifications((prev) => [...prev, { reason: "User disconnected! Please reconnect.", id: uuidv4() }])
            }
        })
        if (incomingCall) {
            socket.current.off("receivingCall")
            socket.current.on("receivingCall", (data) => {
                socket.current.off("answeredCall")
                socket.current.emit("answeredCall", {
                    to: data.from,
                    name: name,
                    accepted: false,
                    reason: `${name} is busy`
                })
            })
        } else if (onCall) {
            socket.current.off("receivingCall")
            socket.current.on("receivingCall", (data) => {
                setIncomingCall(true);
                setCallerId(data.from);
                setCallerName(data.name);
                setUserSignal(data.signal);
                setCallerAvatar(genConfig(data.name))
                socket.current.off("answeredCall")
                socket.current.emit("answeredCall", {
                    to: data.from,
                    name: name,
                    accepted: false,
                    reason: `${name} is on another call, please wait!`
                })
                timeOutRef.current = setTimeout(() => {
                    socket.current.off("answeredCall")
                    socket.current.emit("answeredCall", {
                        to: data.from,
                        name: name,
                        accepted: false,
                        reason: `${name} did not answer the call`
                    })
                    setIncomingCall(false);
                }, 30 * 1000);
            })
        }
        else {
            socket.current.off("receivingCall")
            socket.current.on("receivingCall", (data) => {
                setIncomingCall(true);
                setCallerId(data.from);
                setCallerName(data.name);
                setUserSignal(data.signal);
                setCallerAvatar(genConfig(data.name))
                timeOutRef.current = setTimeout(() => {
                    socket.current.off("answeredCall")
                    socket.current.emit("answeredCall", {
                        to: data.from,
                        name: name,
                        accepted: false,
                        reason: `${name} did not answer the call`
                    })
                    setIncomingCall(false);
                }, 30 * 1000);
            })
        }
    }

    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
            socket.current.off("callUser")
            socket.current.emit("callUser", {
                userToCall: userId,
                signalData: data,
                from: myId,
                name: name
            })
        })

        peer.on("stream", (data) => {
            callerStream.current.srcObject = data;
        })

        socket.current.off("callAccepted")
        socket.current.on("callAccepted", (data) => {
            if (data.accepted === true) {
                dispatch(setOncall({ onCall: true }))
                peer.signal(data.signal)
                setUserName(data.name)
            } else {
                // setNotifications([...notifications, { reason : data.reason, id : notifications.length}])
                setNotifications((prev) => [...prev, { reason: data.reason, id: uuidv4() }])
            }
        })
        peerRef.current = peer
    }

    const answerCall = async () => {
        clearTimeout(timeOutRef.current)
        if (onCall) {
            await peerRef.current.destroy()
        }
        setUserId(callerId)
        setUserName(callerName)
        setUserAvatar(genConfig(userName))
        dispatch(setOncall({ onCall: true }))
        setIncomingCall(false)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        })

        peer.on("signal", (data) => {
            socket.current.off("answeredCall")
            socket.current.emit("answeredCall", {
                to: callerId,
                signal: data,
                accepted: true,
                name: name
            })
        })

        peer.on("stream", (stream) => {
            callerStream.current.srcObject = stream;
        })

        peer.signal(userSignal);
        peerRef.current = peer;
    }

    if (peerRef.current) {
        peerRef.current.on("close", () => {
            dispatch(setOncall({ onCall: false }));
            peerRef.current.destroy()
            setCallerId()
            setUserId()
        })
        peerRef.current.on('error', (error) => {
                // setNotifications((prev) => [...prev, { reason: "Something went wrong! Please reconnect.", id: uuidv4() }])
                console.log(error)
        })
    }

    const endCall = () => {
        peerRef.current.destroy();
        setCallerId()
        setUserId()
    }

    const muteUnmute = () => {
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
        setMute(!mute)
        socket.current.off("mute")
        socket.current.emit("mute", {
            to: userId,
            audio: !mute
        })
    }
    const stopVideo = () => {
        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled)
        setMyVideoOn(!myVideoOn)
        socket.current.off("videoOff")
        socket.current.emit("videoOff", {
            to: userId,
            video: myVideoOn
        })
    }

    const rejectCall = () => {
        setIncomingCall(false)
        clearTimeout(timeOutRef.current)
        socket.current.off("answeredCall")
        socket.current.emit("answeredCall", {
            to: callerId,
            name: name,
            accepted: false,
            reason: `${name} rejected the call`
        })
    }

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
        // setNotifications(notifications.filter((notification)=>notification.id !== id))
    }

    return (
        <div className='flex flex-col-reverse md:flex-row m-2 p-2 gap-4 md:gap-2 items-center md:justify-center md:items-start'>
            <div className="flex w-3/4 border-2 border-black">
                {onCall && <div>
                    <div id='callerAvatar'></div>
                    <div>{userName}</div>
                </div>}
                {stream && <video playsInline ref={myStream} autoPlay muted height="5rem" width="300rem" />}
                {!myVideoOn && <div>Avatar</div>}
                {onCall && <video playsInline ref={callerStream} autoPlay height="5rem" width="300rem" />}
                {onCall && (
                    userVideoOff ? <div>User Video Off</div> : <div>User Video On</div>
                )}
                {onCall && (
                    userMute ? <div>User  Mute</div> : <div>User Unmute</div>
                )}
                {onCall && (
                    <Message socket={socket.current} userId={userId} peer={peerRef.current} />
                )}
                <button onClick={muteUnmute}>Mute</button>
                <button onClick={stopVideo}>Stop video</button>
            </div>
            <div className="flex flex-col gap-4 w-3/4 md:w-1/4 items-center">
                {onCall ? (
                    <div className='flex animate-Appear flex-col items-center p-2 gap-2 w-full bg-slate-200 rounded-lg'>
                        <div className="flex justify-center items-center relative">
                            <div className="flex border-8 border-green-300 rounded-full p-5 motion-safe:animate-ping absolute"></div>
                            <Avatar className='w-20 h-20' {...userAvatar} />
                        </div>
                        <div className="flex flex-wrap justify-center text-lg text-teal-600 gap-2">
                            On a call with
                            <span className="font-bold">{userName}</span>
                        </div>
                        <button className='flex p-1 justify-center w-1/4 bg-red-600 text-white rounded-lg' onClick={endCall}>End Call</button>
                    </div>
                ) : (
                    <div className="flex animate-Appear flex-col items-center p-2 gap-2 w-full bg-slate-200 rounded-lg">
                        <span className="flex text-lg text-teal-600">Enter the Code : </span>
                        <input type="text" onChange={(e) => setUserId(e.target.value)} className='flex w-3/4 p-1 m-1 text-teal-600 rounded focus: outline-none' />
                        <div className="flex w-3/4 p-1 justify-around">
                            <button onClick={callUser} className='flex justify-center items-center text-slate-800 bg-teal-400 p-1 rounded w-1/3 hover:bg-teal-300' >Call</button>
                            <button onClick={() => navigator.clipboard.writeText(myId)} className='flex justify-center items-center text-slate-800 bg-slate-400 p-1 rounded w-1/3 hover:bg-slate-300' >Copy</button>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex flex-col items-end overflow-hidden gap-2 w-3/4 sm:max-w-fit absolute right-0 bottom-20'>
                {notifications.map((notification) => {
                    return <Notifications notification={notification.reason} key={notification.id} onDelete={() => deleteNotification(notification.id)} autoClose={true} />
                })}
            </div>
            {incomingCall && (
                <div className="flex flex-col m-1 p-4 bg-teal-100 gap-2 rounded-xl items-center absolute top-16 w-full sm:w-2/4 md:w-1/3 animate-slideDown">
                    <div className="flex justify-center items-center gap-2">
                        <Avatar className='w-8 h-8' {...callerAvatar} />
                        <div className='text-teal-600 text-lg'>{callerName}</div>
                    </div>
                    <div className="flex w-full md:w-3/4 items-center justify-around">
                        <button onClick={answerCall} className='flex justify-center items-center bg-green-500 p-1 gap-1 rounded-xl text-teal-100 sm:w-1/3 w-1/3'><PhoneCall size={20} className=" animate-wiggle" />Answer</button>
                        <button onClick={rejectCall} className='flex justify-center items-center bg-red-500 p-1 gap-1 rounded-xl text-teal-50 sm:w-1/3 w-1/3' ><XCircle size={20} />Reject</button>
                    </div>
                </div>
            )}
            <div id="userbusy"></div>
            {mute && <div>Muted</div>}
        </div>
    )
}

export default VideoCall
