import {
  Camera,
  MessageCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import { useSelector } from "react-redux";

const ControlsWidget = ({
  muteUnmute,
  stopVideo,
  takeScreenshot,
  mute,
  myVideoOn,
}) => {

  const onCall = useSelector((state) => state.onCall);
  const isDisconnecting = useSelector((state) => state.isDisconnecting);

  return (
    <div className={`flex rounded-xl justify-around w-full bg-slate-300/80 sm:bg-slate-300/50 sm:hover:bg-slate-300/80 text-teal-600 origin-bottom duration-200 group/widget p-2`}>
      <div
        onClick={muteUnmute}
        className="flex items-center justify-center group/myaudio relative z-10 hover:cursor-pointer "
      >
        <span className="flex sm:w-2/3 duration-200 sm:group-hover/widget:w-full">
          {mute ? <Mic /> : <MicOff />}
        </span>
      </div>

      <div
        onClick={stopVideo}
        className="flex items-center justify-center group/myvideo relative z-10 hover:cursor-pointer"
      >
        <span className="flex sm:w-2/3 duration-200 sm:group-hover/widget:w-full">
          {myVideoOn ? <VideoOff /> : <Video />}
        </span>
      </div>

      <div
        id="screenShotBtn"
        onClick={takeScreenshot}
        className="flex items-center justify-center group/snap relative z-10 hover:cursor-pointer"
      >
        <Camera className="flex sm:w-2/3 duration-200 sm:group-hover/widget:w-full" />
      </div>
    </div>
  );
};

export default ControlsWidget;
