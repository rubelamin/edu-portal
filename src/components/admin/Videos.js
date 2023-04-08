import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetVideosQuery } from "../../features/videos/videoApi";
import { loadedVideo } from "../../features/videos/videoSlice";
import VideoRow from "./VideoRow";

export default function Videos() {
  const { data: videoData, isLoading, isError } = useGetVideosQuery();
  const videos = useSelector((state) => state.videos.videos);
  const dispatch = useDispatch();

  useEffect(() => {
    if (videoData?.length > 0) {
      dispatch(loadedVideo(videoData));
    }
  }, [dispatch, videoData]);

  let videoContent = null;

  if (isLoading) {
    videoContent = <p>Video List is loading.....</p>;
  }

  if (!isLoading && isError) {
    videoContent = <p>There is a problem</p>;
  }

  if (!isLoading && !isError && videos?.length === 0) {
    videoContent = <p>There is no video</p>;
  }

  if (!isLoading && !isError && videos?.length > 0) {
    videoContent = videos.map((video) => (
      <VideoRow videoDetails={video} key={video.id} />
    ));
  }

  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-full px-5 lg:px-20">
        <div className="px-3 py-20 bg-opacity-10">
          <div className="w-full flex">
            <Link to="/admin/dashboard" className="btn ">
              Back to Dashboard
            </Link>
            <Link to="/admin/addvideo" className="btn ml-auto">
              Add Video
            </Link>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="divide-y-1 text-base divide-gray-600 w-full">
              <thead>
                <tr>
                  <th className="table-th">Video Title</th>
                  <th className="table-th">Description</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-600/50">
                {videoContent}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
