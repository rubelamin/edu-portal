import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasQuizes: false,
  videoQuize: undefined,
  quizesList: undefined,
  quizeSubmitted: undefined,
  quizOptions: [],
  answerOptions: [],
};

const quizeSlice = createSlice({
  name: "quizes",
  initialState,
  reducers: {
    quizeChecked: (state, action) => {
      state.hasQuizes = action.payload;
    },
    quizeArr: (state, action) => {
      state.videoQuize = undefined;
      state.videoQuize = action.payload;
    },
    addQuizeListed: (state, action) => {
      state.quizesList = undefined;
      state.quizesList = action.payload;
    },
    isQuizSubmitted: (state, action) => {
      state.quizeSubmitted = action.payload;
    },
    optionReducer: (state, action) => {
      state.quizOptions = [];
      state.answerOptions = [];
      action.payload.value.forEach((question, i) => {
        const options = question.options.map((option) => ({
          ...option,
          checked: false,
        }));
        state.quizOptions.push({ ...question, options: options });
        state.answerOptions.push({ ...question, options: options });
      });
    },
    answerReducer: (state, action) => {
      if (state.answerOptions?.length) {
        state.answerOptions[action.payload?.questionID].options[
          action.payload?.optionIndex
        ].checked = action.payload.value;
      }
    },
  },
});

export const {
  quizeChecked,
  quizeArr,
  addQuizeListed,
  isQuizSubmitted,
  optionReducer,
  answerReducer,
} = quizeSlice.actions;
export default quizeSlice.reducer;
