import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignmentList: [],
  assignmentSubmittedList: [],
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    assignmentArr: (state, action) => {
      state.assignmentList = [];
      state.assignmentList = action.payload;
    },
    submittedListArr: (state, action) => {
      state.assignmentSubmittedList = [];
      state.assignmentSubmittedList = action.payload;
    },
  },
});

export const { assignmentArr, submittedListArr } = assignmentSlice.actions;
export default assignmentSlice.reducer;
