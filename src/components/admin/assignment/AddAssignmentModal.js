import React, { useState, useEffect } from "react";

import {
  useGetVideosQuery,
  useGetVideoByIdQuery,
} from "../../../features/videos/videoApi";
import {
  useAddAssignmentMutation,
  useEditAssignmentMutation,
  useGetAssignmentByIdQuery,
} from "../../../features/assignment/assignmentApi";

export default function AddAssignmentModal({
  showModal,
  setShowModal,
  asId,
  setAssignmentId,
}) {
  const { data: assignment } = useGetAssignmentByIdQuery(asId);

  const [title, setTitle] = useState("Assigment");
  const [videoObj, setVideoObj] = useState({});
  const [totalMark, setTotalMark] = useState(100);

  const { data: videos } = useGetVideosQuery();
  const [videoList, setVideoList] = useState([]);

  //   const { videoId, videoTitle } = videoObj || {};

  const { title: initialtitle, totalMark: initialTotalMark } = assignment || {};

  const { data: video } = useGetVideoByIdQuery(assignment?.video_id);

  useEffect(() => {
    if (assignment?.id && video?.id) {
      setTitle(initialtitle);
      setVideoObj(video);
      setTotalMark(initialTotalMark);
    }
  }, [initialtitle, initialTotalMark, assignment?.id, video]);

  useEffect(() => {
    if (video?.id) {
      setVideoObj(video);
    }
  }, [video]);

  useEffect(() => {
    if (videos?.length) {
      setVideoList(videos);
    }
  }, [videos]);

  const assignmentData = {
    title: title,
    video_id: videoObj?.id,
    video_title: videoObj.title,
    totalMark: totalMark,
  };

  const [editAssignment, { isLoading, isError, isSuccess }] =
    useEditAssignmentMutation();
  const [
    addAssignment,
    { isLoading: addLoading, isError: addError, isSuccess: addSuccess },
  ] = useAddAssignmentMutation();

  useEffect(() => {
    if (addSuccess) {
      setShowModal(false);
    }
  }, [addSuccess, setShowModal]);

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false);
    }
  }, [isSuccess, setShowModal]);

  const submitAssignment = (e) => {
    e.preventDefault();
    if (asId) {
      editAssignment({
        id: asId,
        data: assignmentData,
      });
    } else {
      addAssignment(assignmentData);
    }
  };

  let errorText = null;

  if (asId) {
    if (!isLoading && isError) errorText = <p>There is an error</p>;
  } else {
    if (!addLoading && addError) errorText = <p>There is an error</p>;
  }

  const handleModalClose = () => {
    // reset form
    setTitle("");
    setVideoObj({});
    setTotalMark(100);

    setAssignmentId(null);

    setShowModal(false);
  };

  return (
    <>
      {showModal ? (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none popup-overlay">
          <div className="relative w-auto my-6 mx-auto max-w-3xl p-5">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">
                  {asId ? "Edit Assignment" : "Add Assignment"}
                </h3>
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={handleModalClose}
                >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    x
                  </span>
                </button>
              </div>
              <h1>Assignment for lesson</h1>
              <div className="mx-auto lwspopup-form px-5 lg:px-0">
                <form className="mt-8 space-y-6" onSubmit={submitAssignment}>
                  <div className="rounded-md shadow-sm form-element -space-y-px">
                    <div>
                      <select
                        name="videoObj"
                        className="login-input"
                        value={videoObj}
                        onChange={(e) =>
                          setVideoObj(JSON.parse(e.target.value))
                        }
                      >
                        <option value={videoObj}>
                          {videoObj?.title ? videoObj.title : "Select Video"}
                        </option>
                        {videoList?.length &&
                          videoList.map((video) => (
                            <option
                              value={JSON.stringify(video)}
                              key={video.id}
                            >
                              {video.title}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="video-title" className="sr-only">
                        Assignment Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="Assignment Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="optionAAnswere" className="sr-only">
                        Total Mark
                      </label>
                      <input
                        id="totalMark"
                        name="totalMark"
                        type="number"
                        required
                        className="login-input rounded-t-md"
                        placeholder="Assignment Total Mark"
                        value={totalMark}
                        onChange={(e) => setTotalMark(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      disabled={asId ? isLoading : addLoading}
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                      {asId ? "Edit Assignment" : "Submit Assignment"}
                    </button>
                  </div>
                  <div>{errorText}</div>
                </form>
              </div>

              {/* end modal form content  */}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
