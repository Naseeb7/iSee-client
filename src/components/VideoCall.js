import multiavatar from '@multiavatar/multiavatar/esm';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";
import Peer from "simple-peer"
import { setOncall } from '../reducers';

const baseURL = process.env.REACT_APP_BASE_URL

const VideoCall = () => {
    const [myId, setMyId] = useState()
    const [stream, setStream] = useState()
    const [userId, setUserId] = useState()
    const [incomingCall, setIncomingCall] = useState(false)
    const [userSignal, setUserSignal] = useState()
    const [myVideoOn, setMyVideoOn] = useState(true)
    const [userVideoOff, setUserVideoOff] = useState(false)
    const [mute, setMute] = useState(false)
    const [userMute, setUserMute] = useState(false)
    const [userName, setUserName] = useState("")
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
        socket.current.on("myid", (data) => {
            setMyId(data)
        })
        socket.current.on("messagereceived", (data) => {
            console.log(data)
        })
        socket.current.on("userVideoOff", (data) => {
            setUserVideoOff(data)
        })
        socket.current.on("userMute", (data) => {
            setUserMute(data)
        })
        socket.current.on("receivingCall", (data) => {
            setIncomingCall(true);
            setUserId(data.from);
            setUserName(data.name);
            setUserSignal(data.signal);
            // document.getElementById("callerAvatar").innerHTML=multiavatar(data.name)
        })
    }, [])

    const sendMessage = () => {
        socket.current.emit("messagesent", { to: userId, message: name })
    }

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on("signal", (data) => {
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

        socket.current.on("callAccepted", (data) => {
            dispatch(setOncall({ onCall: true }))
            peer.signal(data)
        })
        peerRef.current = peer
    }

    const answerCall = () => {
        dispatch(setOncall({ onCall: true }))
        setIncomingCall(false)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        })

        peer.on("signal", (data) => {
            socket.current.emit("answeredCall", {
                to: userId,
                signal: data
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
            socket.current.off("callAccepted")
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

    return (
        <div className='flex flex-col gap-2 justify-center items-center'>
            {stream && <video playsInline ref={myStream} autoPlay muted height="5rem" width="300rem" />}
            {!myVideoOn && <div>Avatar</div>}
            {onCall && <video playsInline ref={callerStream} autoPlay height="5rem" width="300rem" />}
            {onCall && (
                userVideoOff ? <div>User Video Off</div> : <div>User Video On</div>
            )}
            {onCall && (
                userMute ? <div>User  Mute</div> : <div>User Unmute</div>
            )}
            {mute && <div>Muted</div>}
            <div className="flex">
                <input type="text" onChange={(e) => setUserId(e.target.value)} />
                <button onClick={callUser}>Call</button>
                <button onClick={() => navigator.clipboard.writeText(myId)}>Copy</button>
            </div>
            {incomingCall && (
                <div className="flex">
                    <div id="callerAvatar"></div>
                    <div>{userName}</div>
                    <button onClick={answerCall}>Answer</button>
                </div>
            )}
            {onCall && (
                <div className="flex">
                    <button onClick={endCall}>End</button>
                </div>
            )}
            <button onClick={()=>console.log(peerRef.current)}>Peer</button>
            <button onClick={muteUnmute}>Mute</button>
            <button onClick={stopVideo}>Stop video</button>
        </div>
    )
}

export default VideoCall
