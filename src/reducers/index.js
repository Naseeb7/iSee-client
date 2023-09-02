import { createSlice } from "@reduxjs/toolkit";
import { defaultNames } from "../data";
import * as process from "process";

window.global = window;
window.process = process;
window.Buffer = [];

const initialState = {
  name: defaultNames[Math.floor(Math.random() * defaultNames.length)],
  onCall: false,
  isDisconnecting: false,
  myVideoOff: false,
  mute: false,
  userVideoOff: false,
  userMute: false,
  currentCamera : "user",
};

export const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setOncall: (state, action) => {
      state.onCall = action.payload.onCall;
    },
    setIsDisconnecting: (state, action) => {
      state.isDisconnecting = action.payload.isDisconnecting;
    },
    setMyVideoOff: (state, action) => {
      state.myVideoOff = action.payload.myVideoOff;
    },
    setMute: (state, action) => {
      state.mute = action.payload.mute;
    },
    setUserVideoOff: (state, action) => {
      state.userVideoOff = action.payload.userVideoOff;
    },
    setUserMute: (state, action) => {
      state.userMute = action.payload.userMute;
    },
    setCurrentCamera: (state, action) => {
      state.currentCamera = action.payload.currentCamera;
    },
  },
});
export const {
  setName,
  setOncall,
  setIsDisconnecting,
  setMyVideoOff,
  setMute,
  setUserMute,
  setUserVideoOff,
  setCurrentCamera,
} = stateSlice.actions;
export default stateSlice.reducer;
