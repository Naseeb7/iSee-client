import { Camera, Mic, MicOff, SwitchCamera, Video, VideoOff } from "lucide-react";
import { setCurrentCamera } from "../../reducers";
import { useDispatch, useSelector } from "react-redux";

const ControlsWidget = ({
  muteUnmute,
  stopVideo,
  takeScreenshot,
  mute,
  myVideoOff,
}) => {
  const currentCamera=useSelector((state)=>state.currentCamera)
  const dispatch=useDispatch()
  
  const changeCamera=()=>{
    if(currentCamera === "user"){
        dispatch(setCurrentCamera({ currentCamera : "environment"}))
    }else{
        dispatch(setCurrentCamera({ currentCamera : "user"}))
    }
  }
  return (
    <div
      className={`flex absolute flex-col rounded-r-xl justify-around h-full -right-8 sm:-right-10 bg-slate-800 sm:bg-slate-700 group-hover/myStream:bg-slate-800 sm:group-hover/myStream:p-3 sm:group-hover/myStream:-right-12 text-teal-400 origin-bottom duration-200 group/widget p-1 sm:p-2`}
    >
      <div
        onClick={muteUnmute}
        className="flex items-center justify-center group/myaudio relative hover:cursor-pointer "
      >
        <span className="flex w-3/4 duration-200 sm:group-hover/widget:w-full sm:hover:-translate-y-1">
          {mute ? <Mic /> : <MicOff />}
        </span>
      </div>

      <div
        onClick={stopVideo}
        className="flex items-center justify-center group/myvideo relative hover:cursor-pointer"
      >
        <span className="flex w-3/4 duration-200 sm:group-hover/widget:w-full sm:hover:-translate-y-1">
          {!myVideoOff ? <VideoOff /> : <Video />}
        </span>
      </div>

      <div
        id="screenShotBtn"
        onClick={takeScreenshot}
        className="hidden sm:flex items-center justify-center group/snap relative hover:cursor-pointer sm:hover:-translate-y-1 duration-200"
      >
        <Camera className="flex w-2/3 duration-200 sm:group-hover/widget:w-full" />
      </div>

      <div
        id="screenShotBtn"
        onClick={changeCamera}
        className="flex sm:hidden items-center justify-center group/snap relative hover:cursor-pointer sm:hover:-translate-y-1 duration-200"
      >
        <SwitchCamera className="flex w-3/4 duration-200 sm:group-hover/widget:w-full" />
      </div>
    </div>
  );
};

export default ControlsWidget;
