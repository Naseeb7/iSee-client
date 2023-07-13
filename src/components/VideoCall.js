import multiavatar from '@multiavatar/multiavatar/esm';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";
import Peer from "simple-peer"
import { setOncall } from '../reducers';
import Message from './Message';

const baseURL = process.env.REACT_APP_BASE_URL

const VideoCall = () => {
    const [myId, setMyId] = useState()
    const [stream, setStream] = useState()
    const [userId, setUserId] = useState()
    const [callerId, setCallerId] = useState()
    const [incomingCall, setIncomingCall] = useState(false)
    const [userSignal, setUserSignal] = useState()
    const [myVideoOn, setMyVideoOn] = useState(true)
    const [userVideoOff, setUserVideoOff] = useState(false)
    const [mute, setMute] = useState(false)
    const [userMute, setUserMute] = useState(false)
    const [userName, setUserName] = useState("")
    const [callerName, setCallerName] = useState("")
    const name = useSelector((state) => state.name)
    const socket = useRef()
    const dispatch = useDispatch()
    const onCall = useSelector((state) => state.onCall)
    const myStream = useRef({})
    const callerStream = useRef()
    const peerRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((data) => {
            setStream(data);
            myStream.current.srcObject = data;
        })

        socket.current = io(baseURL, {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: Infinity,
        });

        socket.current.off("myid")
        socket.current.on("myid", (data) => {
            setMyId(data)
        })

        socket.current.off("receivingCall")
        socket.current.on("receivingCall", (data) => {
            setIncomingCall(true);
            setCallerId(data.from);
            setCallerName(data.name);
            setUserSignal(data.signal);
            // document.getElementById("callerAvatar").innerHTML=multiavatar(data.name)
        })

        socket.current.off("userVideoOff")
        socket.current.on("userVideoOff", (data) => {
            setUserVideoOff(data)
        })

        socket.current.off("userMute")
        socket.current.on("userMute", (data) => {
            setUserMute(data)
        })
    }, [])

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
            } else {
                document.getElementById("userbusy").innerHTML = `${data.name} is busy`
            }
        })
        peerRef.current = peer
    }

    const answerCall =async () => {
        if(onCall){
            await peerRef.current.destroy()
        }
        setUserId(callerId)
        setUserName(callerName)
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
                accepted: true
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
            // socket.current.off("callAccepted")
            setUserId("")
        })
        peerRef.current.on('error',(error)=>{
            console.log(error)
        })
    }

    const endCall = () => {
        peerRef.current.destroy();
    }

    const muteUnmute = () => {
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
        setMute(!mute)
        socket.current.emit("mute", {
            to: userId,
            audio: !mute
        })
    }
    const stopVideo = () => {
        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled)
        setMyVideoOn(!myVideoOn)
        socket.current.emit("videoOff", {
            to: userId,
            video: myVideoOn
        })
    }

    const rejectCall = () => {
        socket.current.off("answeredCall")
        socket.current.emit("answeredCall", {
            to: callerId,
            name : name,
            accepted: false
        })
        setCallerId("")
        setIncomingCall(false)
    }

    return (
        <div className='flex flex-col gap-2 justify-center items-center'>
            {onCall && <div>{userName}</div>}
            {stream && <video playsInline ref={myStream} autoPlay muted height="5rem" width="300rem" />}
            {!myVideoOn && <div>Avatar</div>}
            {onCall && <video playsInline ref={callerStream} autoPlay height="5rem" width="300rem" />}
            {onCall && (
                userVideoOff ? <div>User Video Off</div> : <div>User Video On</div>
            )}
            {onCall && (
                userMute ? <div>User  Mute</div> : <div>User Unmute</div>
            )}
            <div id="userbusy"></div>
            {mute && <div>Muted</div>}
            <div className="flex">
                <input type="text" onChange={(e) => setUserId(e.target.value)} />
                <button onClick={callUser}>Call</button>
                <button onClick={() => navigator.clipboard.writeText(myId)}>Copy</button>
            </div>
            {incomingCall && (
                <div className="flex">
                    <div id="callerAvatar"></div>
                    <div>{callerName}</div>
                    <button onClick={answerCall}>Answer</button>
                    <button onClick={rejectCall}>Reject</button>
                </div>
            )}
            {onCall && (
                <div className="flex">
                    <button onClick={endCall}>End</button>
                </div>
            )}
            {onCall && (
                <Message socket={socket.current} userId={userId} />
            )}
            <button onClick={muteUnmute}>Mute</button>
            <button onClick={stopVideo}>Stop video</button>
        </div>
    )
}

export default VideoCall
