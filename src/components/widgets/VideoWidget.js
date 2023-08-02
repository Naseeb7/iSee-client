import React, { useEffect, useState } from 'react'
import Message from './Message';
import { useSelector } from 'react-redux';

const VideoWidget = ( { peer, socket, stream, myStream, callerStream, userId }) => {
    const [myVideoOn, setMyVideoOn] = useState(true);
    const [mute, setMute] = useState(false);
    const [userVideoOff, setUserVideoOff] = useState(false);
    const [userMute, setUserMute] = useState(false);
    const onCall = useSelector((state) => state.onCall);

    useEffect(()=>{
        if(socket){
            socket.off("userVideoOff");
        socket.on("userVideoOff", (data) => {
            setUserVideoOff(data);
        });

        socket.off("userMute");
        socket.on("userMute", (data) => {
            setUserMute(data);
        });
        }
    },[])

    const muteUnmute = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setMute(!mute);
        socket.off("mute");
        socket.emit("mute", {
            to: userId,
            audio: !mute,
        });
    };
    const stopVideo = () => {
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setMyVideoOn(!myVideoOn);
        socket.off("videoOff");
        socket.emit("videoOff", {
            to: userId,
            video: myVideoOn,
        });
    };

  return (
    <div className="flex flex-col w-3/4 border-2 border-red-500 p-2 justify-center items-center">
    <div className={`flex flex-col-reverse md:flex-row w-full border-2 border-green-500 items-center justify-center p-2 duration-1000 gap-2`}>
    {stream && (
        <video
            playsInline
            ref={myStream}
            autoPlay
            muted
            className={`flex md:w-2/5 w-3/4 rounded-xl duration-500`}
        />
    )}
    {onCall && (
        <video
            playsInline
            ref={callerStream}
            autoPlay
            className={`flex animate-Appear border-2 border-black w-2/5`}
        />
    )}
    </div>
    {onCall &&
        (userVideoOff ? <div>User Video Off</div> : <div>User Video On</div>)}
    {onCall && (userMute ? <div>User Mute</div> : <div>User Unmute</div>)}
    {onCall && (
        <Message
            socket={socket}
            userId={userId}
            peer={peer}
        />
    )}
    <button onClick={muteUnmute}>Mute</button>
    <button onClick={stopVideo}>Stop video</button>
</div>
  )
}

export default VideoWidget
