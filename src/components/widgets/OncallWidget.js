import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatWidget from "./ChatWidget";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import ControlsWidget from "./ControlsWidget";
import { MicOff, VideoOff } from "lucide-react";

const OncallWidget = ({
  peer,
  socket,
  stream,
  myStream,
  callerStream,
  userId,
  userName,
}) => {
  const [myVideoOn, setMyVideoOn] = useState(true);
  const [mute, setMute] = useState(false);
  const [userVideoOff, setUserVideoOff] = useState(false);
  const [userMute, setUserMute] = useState(false);
  const onCall = useSelector((state) => state.onCall);
  const isDisconnecting = useSelector((state) => state.isDisconnecting);
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

  useEffect(() => {
    if (peer) {
      peer.on("close", () => {
        setUserMute(false);
        setUserVideoOff(false);
      });
    }
  }, [peer]);
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
        className={`flex flex-col rounded-3xl md:flex-row md:gap-8 w-full items-center justify-center p-2 duration-500 gap-2 relative group/video overflow-hidden`}
      >
        {onCall && (
          <div className="flex relative w-full md:w-2/5 sm:w-4/5">
            <video
              playsInline
              ref={callerStream}
              autoPlay
              className={`flex ${
                isDisconnecting ? "animate-scaleUp" : "animate-scaleDown"
              } bg-slate-800/50 duration-500 origin-top w-full rounded-xl`}
            />
            {userMute && (
              <div className="flex absolute text-teal-300 top-0 p-2 justify-center items-center">
                <MicOff />
              </div>
            )}
            {userVideoOff && (
              <div className="flex flex-col absolute w-full h-full bg-black text-slate-600 top-0 rounded-xl p-2 justify-center items-center">
                <VideoOff className="w-2/4 h-1/6" />
                {userName} turned their video off
              </div>
            )}
          </div>
        )}
        {stream && (
          <div className={`flex ${onCall ? "w-3/5" : "w-full"} md:w-2/5 relative justify-center items-center`}>
            <video
              playsInline
              ref={myStream}
              autoPlay
              muted
              className={`flex rounded-xl duration-500 origin-bottom w-full`}
            />
            {mute && (
              <div className="flex absolute top-1 left-1 text-teal-600">
                <MicOff />
              </div>
            )}
            {!myVideoOn && (
              <div className="flex flex-col absolute w-full h-full justify-center items-center text-teal-600">
                <VideoOff className="w-2/4 h-1/6"/>
                Video turned off
              </div>
            )}
          </div>
        )}
      </div>
      <ControlsWidget
        muteUnmute={muteUnmute}
        stopVideo={stopVideo}
        takeScreenshot={takeScreenshot}
        mute={mute}
        myVideoOn={myVideoOn}
      />
      {onCall && <ChatWidget socket={socket} userId={userId} peer={peer} />}
    </div>
  );
};

export default OncallWidget;
