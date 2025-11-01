import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.js';  // Assuming userReducers should be userReducer
import projectReducer from '../features/projectSlice.js';

const store = configureStore({
  reducer: {
    currUser: userReducer,        // Name the slice for userReducer, assuming it's user
    currProject: projectReducer,
  },
});

export default store;
