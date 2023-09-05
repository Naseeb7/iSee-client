import { Camera, SendHorizonal, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import typingAnimation from "../../assets/typingAnimation.json";
import Lottie from "lottie-react";

const ChatWidget = ({ socket, userId, peer }) => {

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState();
  const inputRef = useRef();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [messages]); // eslint-disable-line

  useEffect(()=>{
    if(peer){
      peer.on("close", () => {
        setMessages([])
        setText("")
        setFile()
      });
    }
  },[peer])

  useEffect(() => {
    if (socket) {
      socket.off("messagereceived");
      socket.on("messagereceived", (data) => {
        if (data.type === "image") {
          const blob = new Blob([data.file], { type: data.mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            setMessages((prev) => [
              ...prev,
              {
                to: data.to,
                message: data.message,
                file: reader.result,
                type: data.type,
                mimeType: data.mimeType,
                fromSelf: false,
              },
            ]);
          };
        } else {
          setMessages((prev) => [
            ...prev,
            {
              to: data.to,
              message: data.message,
              type: data.type,
              fromSelf: false,
            },
          ]);
        }
      });

      socket.off("userTyping");
      socket.on("userTyping", (data) => {
        setUserTyping(!data.typing);
        setTimeout(() => {
          setUserTyping(data.typing);
        }, 1000);
      });
    }
  }, [userId,socket]); // eslint-disable-line

  const sendMessage = () => {
    if (file) {
      const messageObj = {
        to: userId,
        message: text,
        file: file,
        type: "image",
        mimeType: file.type,
      };
      socket.off("messagesent");
      socket.emit("messagesent", messageObj);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setMessages((prev) => [
          ...prev,
          {
            to: userId,
            message: text,
            file: reader.result,
            type: "image",
            mimeType: file.type,
            fromSelf: true,
          },
        ]);
      };
      setFile();
      setText("");
      inputRef.current.value = null;
    } else {
      const messageObj = {
        to: userId,
        message: text,
        type: "text",
      };
      socket.off("messagesent");
      socket.emit("messagesent", messageObj);
      setMessages((prev) => [
        ...prev,
        {
          to: userId,
          message: text,
          type: "text",
          fromSelf: true,
        },
      ]);
      setText("");
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    socket.off("typing");
    socket.emit("typing", {
      to: userId,
      typing: true,
    });
  };

  return (
    <div
      id="chatWidget"
      className="flex flex-col bg-slate-200 w-full gap-2 p-2 rounded-xl animate-scaleDown origin-top"
    >
      <div className="flex text-2xl font-bold items-center text-slate-400">
        ChatBox
      </div>
      <div className="flex relative flex-col p-2 bg-slate-300 rounded-xl gap-2">
        <div className="flex flex-col h-[49vh] overflow-auto pt-2 w-full rounded-xl bg-slate-100 gap-1">
          {messages.map((message) => {
            return (
              <div
                key={uuidv4()}
                ref={scrollRef}
                className={`flex ${
                  message.fromSelf ? "justify-end" : "justify-start"
                } w-full p-1`}
              >
                {message.fromSelf ? (
                  <div className="flex w-2/3 justify-end">
                    {message.type === "image" ? (
                      <div className="flex sm:w-2/3 flex-col p-2 mx-2 items-end bg-slate-700 text-teal-50 rounded-2xl rounded-tr-none">
                        <img
                          className="flex border rounded-xl"
                          src={message.file}
                          alt="message"
                        />
                        <div className="flex p-1">{message.message}</div>
                      </div>
                    ) : (
                      <div className="flex mx-2 p-2 px-3 bg-slate-700 text-teal-50 rounded-2xl rounded-tr-none">
                        {message.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex w-2/3 justify-start items-center">
                    {message.type === "image" ? (
                      <div className="flex sm:w-2/3 flex-col items-start p-2 mx-2 bg-teal-700 text-slate-50  rounded-2xl rounded-tl-none">
                        <img
                          className="flex border rounded-xl"
                          src={message.file}
                          alt="received "
                        />
                        <div className="flex p-1">{message.message}</div>
                      </div>
                    ) : (
                      <div className="flex mx-2 p-2 px-3 bg-teal-700 text-slate-50 rounded-2xl rounded-tl-none">
                        {message.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {userTyping && (
            <div className="flex w-full mx-2">
              <Lottie
                animationData={typingAnimation}
                autoPlay
                loop
                className="flex w-1/12"
              />
            </div>
          )}
        </div>
        {file && (
          <div className="flex w-full justify-center items-center p-2 bottom-20 text-slate-400 absolute overflow-hidden">
            <div className="flex justify-between items-center w-2/3 sm:w-1/3 p-2 bg-slate-200 rounded-xl animate-slideUpAndBounce">
              <img src={URL.createObjectURL(file)} alt="" className="w-1/4" />
              <div className="flex">{file.name.substring(0, 10)}...</div>
              <X onClick={() => setFile()} className="w-1/12 cursor-pointer" />
            </div>
          </div>
        )}
        <div className="flex justify-around items-center rounded-b-xl p-2 gap-2">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder={file ? file.name : "Konichiwa..."}
            className="flex w-4/5 p-1 rounded-lg text-teal-800 outline-none focus:bg-teal-50 resize-none"
            rows={2}
          />
          <div className="flex w-1/5 justify-center items-center text-teal-700">
            <button
              onClick={sendMessage}
              className="flex hover:translate-x-1 duration-200"
            >
              <SendHorizonal />
            </button>
            <input
              ref={inputRef}
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="file"
              className="flex w-full hover:-translate-y-1 duration-200 hover:cursor-pointer"
            >
              <Camera className="flex w-full " />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
