import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatWidget from "./ChatWidget";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import ControlsWidget from "./ControlsWidget";
import { MessageCircle, MicOff, VideoOff } from "lucide-react";
import {
  setMute,
  setMyVideoOff,
  setUserMute,
  setUserVideoOff,
} from "../../reducers";

const OncallWidget = ({
  peer,
  socket,
  stream,
  myStream,
  callerStream,
  userId,
  userName,
}) => {

  const onCall = useSelector((state) => state.onCall);
  const myVideoOff = useSelector((state) => state.myVideoOff);
  const mute = useSelector((state) => state.mute);
  const userVideoOff = useSelector((state) => state.userVideoOff);
  const userMute = useSelector((state) => state.userMute);
  const screenShotRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.off("userVideoOff")
      socket.on("userVideoOff", (data) => {
        dispatch(setUserVideoOff({ userVideoOff: data }));
      });

      socket.off("userMute")
      socket.on("userMute", (data) => {
        dispatch(setUserMute({ userMute: data }));
      });
    }
  }, [socket]); // eslint-disable-line

  useEffect(() => {
    if (peer) {
      peer.on("close", () => {
        dispatch(setUserMute({ userMute: false }));
        dispatch(setUserVideoOff({ userVideoOff: false }));
      });
    }
  }, [peer]); // eslint-disable-line

  const muteUnmute = () => {
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    dispatch(setMute({ mute: !mute }));
    socket.off("mute")
    socket.emit("mute", {
      to: userId,
      audio: !mute,
    });
  };
  const stopVideo = () => {
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    dispatch(setMyVideoOff({ myVideoOff: !myVideoOff }));
    socket.off("videoOff")
    socket.emit("videoOff", {
      to: userId,
      video: !myVideoOff,
    });
  };

  const takeScreenshot = async () => {
    const canvas = await html2canvas(screenShotRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    downloadjs(dataUrl, "ScreenShot.png", "image/png");
  };

  return (
    <div className="flex flex-col w-full md:w-3/4 gap-2 justify-center items-center ">
      <div
        ref={screenShotRef}
        className={`flex flex-col bg-slate-200 rounded-3xl md:gap-4 w-full items-center justify-center p-2 duration-500 gap-2 group/video overflow-hidden`}
      >
        {stream && (
          <div
            className={`flex w-4/5 md:w-2/5 relative justify-center items-center duration-300 group/myStream -translate-x-4 sm:-translate-x-0 `}
          >
            <video
              playsInline
              ref={myStream}
              autoPlay
              muted
              className={`flex rounded-l-xl duration-500 origin-bottom w-full`}
            />
            {mute && (
              <div className="flex absolute top-1 left-1 text-teal-600 z-10">
                <MicOff />
              </div>
            )}
            {myVideoOff && (
              <div className="flex flex-col animate-Appear bg-black rounded-l-xl absolute w-full h-full justify-center items-center text-teal-600">
                <VideoOff className="w-2/4 h-1/6" />
                Video turned off
              </div>
            )}
            <ControlsWidget
              muteUnmute={muteUnmute}
              stopVideo={stopVideo}
              takeScreenshot={takeScreenshot}
              mute={mute}
              myVideoOff={myVideoOff}
            />
          </div>
        )}
        {onCall && (
          <div
            className={`flex origin-top animate-scaleDown duration-300 relative w-full md:w-2/5 sm:w-4/5 group/userStream`}
          >
            <video
              playsInline
              ref={callerStream}
              autoPlay
              className={`flex bg-slate-800/50 duration-500 origin-top w-full rounded-xl sm:rounded-r-none`}
            />
            {userMute && (
              <div className="flex absolute text-teal-300 top-0 p-2 z-10 justify-center items-center">
                <MicOff />
              </div>
            )}
            {userVideoOff && (
              <div className="flex flex-col animate-Appear absolute w-full h-full bg-black text-slate-600 top-0 rounded-l-xl p-2 justify-center items-center">
                <VideoOff className="w-2/4 h-1/6" />
                {userName} turned their video off
              </div>
            )}
            <div className="hidden sm:flex absolute flex-col rounded-r-xl items-center justify-center h-full -right-10 bg-slate-700 group-hover/userStream:bg-slate-800 group-hover/userStream:p-3 group-hover/userStream:-right-12 text-teal-400 origin-bottom duration-200 p-2 group/userWidget">
              <a
                href="#chatWidget"
                className="flex cursor-pointer justify-center items-center sm:hover:-translate-y-1 duration-200"
              >
                <MessageCircle className="w-2/3 sm:group-hover/userWidget:w-full duration-200" />
              </a>
            </div>
          </div>
        )}
      </div>
      {onCall && (
        <ChatWidget
          socket={socket}
          userId={userId}
          peer={peer}
        />
      )}
    </div>
  );
};

export default OncallWidget;
