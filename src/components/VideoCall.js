import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import {
  setOncall,
  setUserMute,
  setUserVideoOff,
} from "../reducers";
import Avatar, { genConfig } from "react-nice-avatar";
import Notifications from "./widgets/Notifications";
import { v4 as uuidv4 } from "uuid";
import { PhoneCall, XCircle } from "lucide-react";
import OncallWidget from "./widgets/OncallWidget";

const baseURL = process.env.REACT_APP_BASE_URL;

const VideoCall = () => {
  const [myId, setMyId] = useState();
  const [stream, setStream] = useState({});
  const [notifications, setNotifications] = useState([]);
  const name = useSelector((state) => state.name);
  const [callerId, setCallerId] = useState();
  const [userSignal, setUserSignal] = useState();
  const [callerName, setCallerName] = useState("");
  const [callerAvatar, setCallerAvatar] = useState();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState();
  const [incomingCall, setIncomingCall] = useState(false);
  const onCall = useSelector((state) => state.onCall);
  const myVideoOff = useSelector((state) => state.myVideoOff);
  const mute = useSelector((state) => state.mute);
  const [callerMute, setCallerMute] = useState(false);
  const [callerVideoOff, setCallerVideoOff] = useState(false);
  const currentCamera = useSelector((state) => state.currentCamera);
  const dispatch = useDispatch();
  const timeOutRef = useRef();
  const socket = useRef();
  const myStream = useRef({});
  const callerStream = useRef();
  const peerRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: currentCamera }, audio: true })
      .then((data) => {
        setStream(data);
        myStream.current.srcObject = data;
      });

    socket.current = io(baseURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
    });

    socket.current.off("myid");
    socket.current.on("myid", (data) => {
      setMyId(data);
    });

    socket.current.off("callEnded");
    socket.current.on("callEnded", (data) => {
      peerRef.current.destroy();
    });

    socket.current.off("on_error");
    socket.current.on("on_error", () => {
      setNotifications((prev) => [
        ...prev,
        { reason: "Something went wrong! Please reconnect.", id: uuidv4() },
      ]);
    });
  }, []); // eslint-disable-line

  useEffect(()=>{
    if (socket.current) {
    socket.current.off("userDisconnected");
    socket.current.on("userDisconnected", (data) => {
      if (data === userId) {
        peerRef.current.destroy();
        setNotifications((prev) => [
          ...prev,
          { reason: "User disconnected! Please reconnect.", id: uuidv4() },
        ]);
      }
    });
    if (incomingCall) {
      socket.current.off("receivingCall");
      socket.current.on("receivingCall", (data) => {
        socket.current.off("answeredCall");
        socket.current.emit("answeredCall", {
          to: data.from,
          name: name,
          accepted: false,
          reason: `${name} is busy`,
        });
      });
    } else if (onCall) {
      socket.current.off("receivingCall");
      socket.current.on("receivingCall", (data) => {
        setIncomingCall(true);
        setCallerId(data.from);
        setCallerName(data.name);
        setUserSignal(data.signal);
        setCallerAvatar(genConfig(data.name));
        socket.current.off("answeredCall");
        socket.current.emit("answeredCall", {
          to: data.from,
          name: name,
          accepted: false,
          reason: `${name} is on another call, please wait!`,
        });
        timeOutRef.current = setTimeout(() => {
          socket.current.off("answeredCall");
          socket.current.emit("answeredCall", {
            to: data.from,
            name: name,
            accepted: false,
            reason: `${name} did not answer the call`,
          });
          setIncomingCall(false);
        }, 30 * 1000);
      });
    } else {
      socket.current.off("receivingCall");
      socket.current.on("receivingCall", (data) => {
        setIncomingCall(true);
        setCallerId(data.from);
        setCallerName(data.name);
        setCallerVideoOff(data.video);
        setCallerMute(data.mute);
        setUserSignal(data.signal);
        setCallerAvatar(genConfig(data.name));
        timeOutRef.current = setTimeout(() => {
          socket.current.off("answeredCall");
          socket.current.emit("answeredCall", {
            to: data.from,
            name: name,
            accepted: false,
            reason: `${name} did not answer the call`,
          });
          setIncomingCall(false);
        }, 30 * 1000);
      });
    }
  }
  },[incomingCall]); // eslint-disable-line

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.off("callUser");
      socket.current.emit("callUser", {
        userToCall: userId,
        signalData: data,
        from: myId,
        name: name,
        video: myVideoOff,
        mute: mute,
      });
    });

    peer.on("stream", (data) => {
      callerStream.current.srcObject = data;
    });

    socket.current.off("callAccepted");
    socket.current.on("callAccepted", (data) => {
      if (data.accepted === true) {
        dispatch(setOncall({ onCall: true }));
        peer.signal(data.signal);
        setUserName(data.name);
        dispatch(setUserVideoOff({ userVideoOff: data.video }));
        dispatch(setUserMute({ userMute: data.mute }));
      } else {
        setNotifications((prev) => [
          ...prev,
          { reason: data.reason, id: uuidv4() },
        ]);
      }
    });
    peerRef.current = peer;
  };

  const answerCall = async () => {
    clearTimeout(timeOutRef.current);
    if (onCall) {
      await peerRef.current.destroy();
    }
    setUserId(callerId);
    setCallerId("");
    setUserName(callerName);
    dispatch(setUserVideoOff({ userVideoOff: callerVideoOff }));
    dispatch(setUserMute({ userMute: callerMute }));
    setUserAvatar(genConfig(userName));
    dispatch(setOncall({ onCall: true }));
    setIncomingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.off("answeredCall");
      socket.current.emit("answeredCall", {
        to: callerId,
        signal: data,
        accepted: true,
        name: name,
        video: myVideoOff,
        mute: mute,
      });
    });

    peer.on("stream", (stream) => {
      callerStream.current.srcObject = stream;
    });

    peer.signal(userSignal);
    peerRef.current = peer;
  };

  if (peerRef.current) {
    peerRef.current.on("close", () => {
      dispatch(setOncall({ onCall: !onCall }));
      peerRef.current.destroy();
      setCallerId("");
      setUserId("");
    });
    peerRef.current.on("error", (error) => {
      console.log(error);
    });
  }

  const endCall = () => {
    peerRef.current.destroy();
    setUserId("");
  };

  const rejectCall = () => {
    setIncomingCall(false);
    clearTimeout(timeOutRef.current);
    socket.current.off("answeredCall");
    socket.current.emit("answeredCall", {
      to: callerId,
      name: name,
      accepted: false,
      reason: `${name} rejected the call`,
    });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="flex flex-col-reverse md:flex-row m-2 p-2 gap-4 md:gap-2 items-center md:justify-center md:items-start">
      {/* Video Widget */}
      <OncallWidget
        peer={peerRef.current}
        socket={socket.current}
        stream={stream}
        myStream={myStream}
        callerStream={callerStream}
        userId={userId}
        userName={userName}
      />

      {/* Calling Widget */}
      <div className="flex flex-col gap-2 relative w-11/12 md:w-1/4 items-center justify-center overflow-hidden  rounded-2xl">
        <div className="flex w-full relative bg-slate-200 rounded-xl">
          {/* OnCall */}
          <div
            className={`flex ${
              onCall ? "translate-x-0" : "translate-x-full"
            } origin-left duration-700 flex-col items-center p-2 gap-2 w-full rounded-xl`}
          >
            <div className="flex justify-center items-center relative">
              <div className="flex border-8 border-green-300 rounded-full p-5 motion-safe:animate-ping absolute"></div>
              <Avatar className="w-20 h-20" {...userAvatar} />
            </div>
            <div className="flex flex-wrap justify-center text-lg text-teal-600 gap-2">
              On a call with
              <span className="font-bold">{userName}</span>
            </div>
            <button
              className="flex relative overflow-hidden group p-1 justify-center items-center w-2/4 sm:w-1/4 bg-red-600 text-slate-200 rounded-full hover:text-white"
              onClick={endCall}
            >
              <span className="absolute flex w-full h-full bg-red-700 rounded-full -translate-x-full group-hover:translate-x-0 duration-300 -z-1"></span>
              <span className="z-10">End Call</span>
            </button>
          </div>

          {/* Not Oncall */}
          <div
            className={`flex ${
              onCall ? "-translate-x-full" : "translate-x-0"
            } origin-right absolute h-full justify-center duration-700 flex-col items-center p-2 gap-2 w-full`}
          >
            <span className="flex text-lg text-teal-600">
              Enter the Code :{" "}
            </span>
            <input
              type="text"
              onChange={(e) => setUserId(e.target.value)}
              className="flex w-3/4 p-2 m-1 text-teal-600 rounded-2xl outline-none focus:bg-teal-50 duration-200"
              value={userId}
            />
            <div className="flex w-3/4 p-1 justify-around">
              <button
                onClick={callUser}
                className="flex relative group justify-center items-center overflow-hidden text-slate-800 bg-teal-400 p-1 rounded-full w-1/3 hover:text-teal-300"
              >
                <span className="absolute flex w-full h-full rounded-full bg-teal-800 -translate-x-full group-hover:translate-x-0 duration-300 -z-1"></span>
                <span className="z-10">Call</span>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(myId)}
                className="flex group relative overflow-hidden justify-center items-center text-slate-800 bg-slate-400 p-1 rounded-full w-1/3 hover:text-slate-400 "
              >
                <span className="absolute flex w-full h-full rounded-full bg-slate-800 -translate-x-full group-hover:translate-x-0 duration-300 -z-1"></span>
                <span className=" z-10">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Widget */}
      <div className="flex flex-col items-end overflow-hidden gap-2 w-3/4 sm:max-w-fit absolute right-0 bottom-20">
        {notifications.map((notification) => {
          return (
            <Notifications
              notification={notification.reason}
              key={notification.id}
              onDelete={() => deleteNotification(notification.id)}
              autoClose={true}
            />
          );
        })}
      </div>

      {/* Incoming Call Widget */}
      {incomingCall && (
        <div className="flex flex-col m-1 p-4 bg-teal-100 gap-2 rounded-xl items-center absolute top-12 sm:top-14 w-11/12 sm:w-2/4 md:w-1/3 animate-slideDown">
          <div className="flex justify-center items-center gap-2">
            <Avatar className="w-8 h-8" {...callerAvatar} />
            <div className="text-teal-600 text-lg">{callerName}</div>
          </div>
          <div className="flex flex-wrap w-full md:w-3/4 items-center justify-around">
            <button
              onClick={answerCall}
              className="flex relative overflow-hidden group justify-center items-center bg-green-500 p-1 rounded-full text-slate-200 sm:w-1/3 w-2/5 hover:text-slate-100"
            >
              <span className="absolute flex w-full h-full rounded-full bg-green-600 -translate-x-full group-hover:translate-x-0 duration-300 -z-1"></span>
              <span className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 z-10">
                <PhoneCall size={20} className=" animate-wiggle" />
                Answer
              </span>
            </button>
            <button
              onClick={rejectCall}
              className="flex relative overflow-hidden group justify-center items-center bg-red-500 p-1 gap-1 rounded-full text-slate-200 sm:w-1/3 w-2/5 hover:text-slate-100"
            >
              <span className="absolute flex w-full h-full rounded-full bg-red-600 -translate-x-full group-hover:translate-x-0 duration-300 -z-1"></span>
              <span className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 z-10">
                <XCircle size={20} />
                Reject
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
