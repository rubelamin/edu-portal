import { apiSlice } from "../api/apiSlice";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentsByVideoId: builder.query({
      query: (vId) => ({
        url: `/assignments?video_id=${vId}`,
      }),
    }),
    // end get a assignment by video id in student course video
    getAssignments: builder.query({
      query: () => ({
        url: `/assignments`,
      }),
    }),
    // end get all assignment
    getAssignmentById: builder.query({
      query: (id) => ({
        url: `/assignments/${id}`,
      }),
    }),
    // end get a assignment by id in assignment edit
    addAssignment: builder.mutation({
      query: (data) => ({
        url: `/assignments`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const assRes = await queryFulfilled;
          if (assRes?.data?.id) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getAssignments",
                undefined,
                (draft) => {
                  draft.push(assRes.data);
                }
              )
            );
          }
        } catch (err) {}
      },
    }),
    // end add assignment
    editAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const editRes = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignments",
            undefined,
            (draft) => {
              // eslint-disable-next-line eqeqeq
              const asmnt = draft.find((as) => as.id == arg.id);

              asmnt.title = arg.data.title;
              asmnt.video_id = arg.data.video_id;
              asmnt.video_title = arg.data.video_title;
              asmnt.totalMark = arg.data.totalMark;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          editRes.undo();
        }
      },
    }),
    // end edit assignment
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const deltRes = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignments",
            undefined,
            (draft) => {
              // eslint-disable-next-line eqeqeq
              const index = draft.findIndex((as) => as.id == arg.id);
              draft.splice(index, 1);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          deltRes.undo();
        }
      },
    }),
    // end delete assignment
    assignmentRepoSubmit: builder.mutation({
      query: (data) => ({
        url: `/assignmentMark`,
        method: "POST",
        body: data,
      }),
    }),

    // end assignment submit by student
    checkAssignmentIsSubmit: builder.query({
      query: ({ assignment_id, student_id }) => ({
        url: `/assignmentMark?assignment_id=${assignment_id}&student_id=${student_id}`,
        method: "GET",
      }),
    }),

    // end checking assignment is submitted or not by student
    studentAssignmentMark: builder.query({
      query: (student_id) => ({
        url: `/assignmentMark?student_id=${student_id}`,
        method: "GET",
      }),
    }),
    // end get logged in user assignment mark
    getAssignmentSubmittedList: builder.query({
      query: () => ({
        url: `/assignmentMark`,
      }),
    }),

    // end get all submitted assignment list
    submitMark: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignmentMark/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const markRes = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignmentSubmittedList",
            undefined,
            (draft) => {
              // eslint-disable-next-line eqeqeq
              const assignment = draft.find((ass) => ass.id == arg.id);
              assignment.student_id = arg.data.student_id;
              assignment.student_name = arg.data.student_name;
              assignment.assignment_id = arg.data.assignment_id;
              assignment.title = arg.data.title;
              assignment.createdAt = arg.data.createdAt;
              assignment.totalMark = arg.data.totalMark;
              assignment.mark = arg.data.mark;
              assignment.repo_link = arg.data.repo_link;
              assignment.status = arg.data.status;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (err) {
          markRes.undo();
        }
      },
    }),

    // end mark submit by admin
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentsByVideoIdQuery,
  useGetAssignmentByIdQuery,
  useAddAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
  useAssignmentRepoSubmitMutation,
  useCheckAssignmentIsSubmitQuery,
  useGetAssignmentSubmittedListQuery,
  useSubmitMarkMutation,
  useStudentAssignmentMarkQuery,
} = assignmentApi;
