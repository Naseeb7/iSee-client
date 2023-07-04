import { configureStore } from '@reduxjs/toolkit'
import stateReducer from '../reducers'
export default configureStore({
  reducer: stateReducer,
})