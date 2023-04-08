import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSliceReducer from "../features/auth/authSlice";
import videoSliceReducer from "../features/videos/videoSlice";
import quizeSliceReducer from "../features/quizes/quizeSlice";
import assignmentSliceReducer from "../features/assignment/assignmentSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    videos: videoSliceReducer,
    quizes: quizeSliceReducer,
    assignments: assignmentSliceReducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});
