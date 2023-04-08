import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    loadedVideo: (state, action) => {
      state.videos = action.payload;
    },
  },
});

export const { loadedVideo } = videoSlice.actions;
export default videoSlice.reducer;
