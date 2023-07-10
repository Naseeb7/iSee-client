import { createSlice } from '@reduxjs/toolkit'
import { defaultNames } from '../data'
import * as process from 'process';

window.global = window;
window.process = process;
window.Buffer = [];

const initialState={
  name : defaultNames[Math.floor(Math.random() * defaultNames.length)],
  onCall : false,
}

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setName: (state,action) => {
      state.name= action.payload.name
    },
    setOncall: (state,action) => {
      state.onCall= action.payload.onCall
    },
  },
})
export const { setName, setOncall } = stateSlice.actions
export default stateSlice.reducer