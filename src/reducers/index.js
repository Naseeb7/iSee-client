import { createSlice } from '@reduxjs/toolkit'
import { defaultNames } from '../data'

const initialState={
  name : defaultNames[Math.floor(Math.random() * defaultNames.length)],
}

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setName: (state,action) => {
      state.name= action.payload.name
    },
  },
})
export const { setName } = stateSlice.actions
export default stateSlice.reducer