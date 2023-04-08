import { apiSlice } from "../api/apiSlice";
import { isQuizSubmitted } from "./quizeSlice";
// import { quizeChecked } from "./quizeSlice";

export const quizeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuizes: builder.query({
      query: () => ({
        url: `/quizzes`,
      }),
    }),
    // end get all quizess in admin panel
    getQuizes: builder.query({
      query: (videoId) => ({
        url: `/quizzes?video_id=${videoId}`,
      }),
    }),
    // end get quizess in a course video
    getQuizeById: builder.query({
      query: (qzId) => ({
        url: `/quizzes/${qzId}`,
      }),
    }),
    // end get quize in quiz edit modal
    getAllQuizeMark: builder.query({
      query: () => ({
        url: `/quizMark`,
        method: "GET",
      }),
    }),
    // end checking assignment is submitted or not by student
    checkQuizIsSubmit: builder.query({
      query: ({ video_id, student_id }) => ({
        url: `/quizMark?video_id=${video_id}&student_id=${student_id}`,
        method: "GET",
      }),
    }),
    // end checking assignment is submitted or not by student
    studentQuizMark: builder.query({
      query: (student_id) => ({
        url: `/quizMark?student_id=${student_id}`,
        method: "GET",
      }),
    }),
    // end getting logged in student quiz mark
    submitQuize: builder.mutation({
      query: (data) => ({
        url: `/quizMark`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const quizSubRes = dispatch(
          apiSlice.util.updateQueryData(
            "getQuizes",
            arg?.data?.video_id,
            (draft) => {
              dispatch(isQuizSubmitted(true));
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          quizSubRes.undo();
        }
      },
    }),
    //end submit quize by student
    addQuize: builder.mutation({
      query: (data) => ({
        url: `/quizzes`,
        method: "POST",
        body: data,
      }),
      // pessimistic quiz list upate in admin panel
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const qRes = await queryFulfilled;
          if (qRes?.data?.id) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getAllQuizes",
                undefined,
                (draft) => {
                  draft.push(qRes.data);
                }
              )
            );
          }
        } catch (err) {}
        // end pessimistic quiz list update in admin panel
      },
    }),
    // end add quize by admin
    editQuize: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quizzes/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // quiz list updated on the UI using pessimistic way
        try {
          const { data: editedQuiz } = await queryFulfilled;

          if (editedQuiz?.id) {
            dispatch(
              apiSlice.util.updateQueryData("getQuizeById", arg.id, (draft) => {
                // eslint-disable-next-line eqeqeq
                const quiz = draft.find((qz) => qz.id == arg.id);

                quiz.question = arg.data.question;
                quiz.video_id = arg.data.video_id;
                quiz.video_title = arg.data.video_title;
                quiz.options[0].option = arg.data.options[0].option;
                quiz.options[0].isCorrect = arg.data.options[0].isCorrect;
                quiz.options[1].option = arg.data.options[1].option;
                quiz.options[1].isCorrect = arg.data.options[1].isCorrect;
                quiz.options[2].option = arg.data.options[2].option;
                quiz.options[2].isCorrect = arg.data.options[2].isCorrect;
                quiz.options[3].option = arg.data.options[3].option;
                quiz.options[3].isCorrect = arg.data.options[3].isCorrect;
              })
            );
          }
        } catch (err) {}
        // end quiz list updated on the UI using pessimistic way
      },
    }),
    // end edit quize by admin
    deleteQuize: builder.mutation({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      // optimistic quiz list upate in admin panel
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const qRes = dispatch(
          apiSlice.util.updateQueryData("getAllQuizes", undefined, (draft) => {
            // eslint-disable-next-line eqeqeq
            const index = draft.findIndex((qz) => qz.id == arg.id);
            draft.splice(index, 1);
          })
        );
        // end optimistic quiz list update in admin panel

        try {
          await queryFulfilled;
        } catch (err) {
          qRes.undo();
        }
      },
    }),

    // end delete quize by admin using quize id
  }),
});

export const {
  useGetAllQuizesQuery,
  useGetQuizesQuery,
  useGetQuizeByIdQuery,
  useSubmitQuizeMutation,
  useAddQuizeMutation,
  useEditQuizeMutation,
  useDeleteQuizeMutation,
  useCheckQuizIsSubmitQuery,
  useStudentQuizMarkQuery,
  useGetAllQuizeMarkQuery,
} = quizeApi;
