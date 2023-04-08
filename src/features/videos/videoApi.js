import { apiSlice } from "../api/apiSlice";

export const videoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => ({
        url: `/videos`,
      }),
    }),

    getVideoById: builder.query({
      query: (id) => `/videos/${id}`,
    }),

    // end get video by id

    addVideo: builder.mutation({
      query: (data) => ({
        url: `/videos`,
        method: "POST",
        body: data,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const vdata = await queryFulfilled;
      //     console.log(arg);
      //     console.log(vdata);
      //   } catch (err) {}
      // },
    }),
    editVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const editRes = dispatch(
          apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
            // eslint-disable-next-line eqeqeq
            const vdo = draft.find((v) => v.id == arg.id);

            vdo.title = arg.data.title;
            vdo.description = arg.data.description;
            vdo.url = arg.data.url;
            vdo.views = arg.data.views;
            vdo.duration = arg.data.duration;
          })
        );
        // end optimistic
        try {
          await queryFulfilled;
        } catch (error) {
          editRes.undo();
        }
      },
    }),
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic update video state
        const deleteRes = dispatch(
          apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
            const index = draft.findIndex((v) => v.id === arg.id);
            draft.splice(index, 1);
          })
        );
        // end optimistic update video state

        try {
          await queryFulfilled;
        } catch (err) {
          deleteRes.undo();
        }
      },
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useAddVideoMutation,
  useEditVideoMutation,
  useDeleteVideoMutation,
} = videoApi;
