import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatWidget from "./ChatWidget";
import {
  Camera,
  MessageCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";

const OncallWidget = ({
  peer,
  socket,
  stream,
  myStream,
  callerStream,
  userId,
}) => {
  const [myVideoOn, setMyVideoOn] = useState(true);
  const [mute, setMute] = useState(false);
  const [userVideoOff, setUserVideoOff] = useState(false);
  const [userMute, setUserMute] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const onCall = useSelector((state) => state.onCall);
  const screenShotRef = useRef();

  useEffect(() => {
    if (socket) {
      socket.off("userVideoOff");
      socket.on("userVideoOff", (data) => {
        setUserVideoOff(data);
      });

      socket.off("userMute");
      socket.on("userMute", (data) => {
        setUserMute(data);
      });
    }
  }, []);

  // useEffect(() => {
  //     const el = document.querySelector("#stickyElement")
  //     const observer = new IntersectionObserver(
  //         ([e]) => {
  //             if( el.getBoundingClientRect().top===0){
  //                 setIsPinned(true)
  //             }else{
  //                 setIsPinned(false)
  //             }
  //         },
  //         {
  //             threshold: [1]
  //         }
  //     );

  //     observer.observe(el);
  //     // setIsPinned(el.getBoundingClientRect().top===0 ? true : false)
  // }, [])

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

  const takeScreenshot = async () => {
    const canvas = await html2canvas(screenShotRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    downloadjs(dataUrl, "ScreenShot.png", "image/png");
  };

  return (
    <div className="flex flex-col w-full md:w-3/4 p-2 justify-center items-center ">
      <div
        ref={screenShotRef}
        className={`flex flex-col rounded-3xl md:flex-row md:gap-8 w-full items-center justify-center p-2 duration-1000 gap-2 relative group/video overflow-hidden`}
      >
        {onCall && (
          <video
            playsInline
            ref={callerStream}
            autoPlay
            className={`flex animate-Appear bg-teal-500 w-full md:w-2/5 sm:w-4/5 rounded-xl`}
          />
        )}
        {stream && (
          <video
            playsInline
            ref={myStream}
            autoPlay
            muted
            className={`flex md:w-2/5 ${
              onCall ? "w-3/5 " : "w-full"
            } rounded-xl duration-500`}
          />
        )}
        <div className="flex justify-around w-full absolute bottom-0 bg-slate-700/60 text-teal-300 translate-y-1/3 group-hover/video:translate-y-0 origin-bottom duration-200 group/widget p-2 rounded-b-3xl">
          <div
            onClick={muteUnmute}
            className="flex items-center justify-center group/myaudio relative z-10 hover:cursor-pointer "
          >
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-l-xl duration-200 p-2 transition-all -translate-x-full group-hover/myaudio:scale-x-100 origin-right">
              Mic
            </span>
            <span className="flex w-1/2 duration-200 group-hover/video:w-full">{mute ? <Mic /> : <MicOff />}</span>
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-r-xl duration-200 p-2 transition-all translate-x-full group-hover/myaudio:scale-x-100 origin-left">
              {mute ? "Off" : "On"}
            </span>
          </div>

          <div
            onClick={stopVideo}
            className="flex items-center justify-center group/myvideo relative z-10 hover:cursor-pointer"
          >
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-l-xl duration-200 p-2 transition-all -translate-x-full group-hover/myvideo:scale-x-100 origin-right">
              Video
            </span>
            <span className="flex w-1/2 duration-200 group-hover/video:w-full">{myVideoOn ? <VideoOff /> : <Video />}</span>
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-r-xl duration-200 p-2 transition-all translate-x-full group-hover/myvideo:scale-x-100 origin-left">
              {myVideoOn ? "On" : "Off"}
            </span>
          </div>

          <a
            href="#chatWidget"
            className="flex items-center justify-center group/chat relative z-10 hover:cursor-pointer"
          >
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-l-xl duration-200 p-2 transition-all -translate-x-full  group-hover/chat:scale-x-100 origin-right">
              Chat
            </span>
            <MessageCircle className="flex w-1/2 duration-200 group-hover/video:w-full" />
          </a>

          <div
            id="screenShotBtn"
            onClick={takeScreenshot}
            className="flex items-center justify-center group/snap relative z-10 hover:cursor-pointer"
          >
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-l-xl duration-200 p-2 transition-all -translate-x-full group-hover/snap:scale-x-100 origin-right">
              Take
            </span>
            <Camera className="flex w-1/2 duration-200 group-hover/video:w-full"/>
            <span className="hidden sm:flex scale-x-0 -z-10 absolute rounded-r-xl duration-200 p-2 transition-all translate-x-3/4 group-hover/snap:scale-x-100 origin-left">
              Snapshot
            </span>
          </div>
        </div>
      </div>
      {onCall &&
        (userVideoOff ? <div>User Video Off</div> : <div>User Video On</div>)}
      {onCall && (userMute ? <div>User Mute</div> : <div>User Unmute</div>)}
      {onCall && <ChatWidget socket={socket} userId={userId} peer={peer} />}
      <button onClick={muteUnmute}>Mute</button>
      <button onClick={stopVideo}>Stop video</button>
      <button onClick={() => console.log(isPinned)}>Pinned</button>
    </div>
  );
};

export default OncallWidget;
