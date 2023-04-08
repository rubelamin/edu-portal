import React, { useState, useEffect } from "react";

import {
  useEditQuizeMutation,
  useGetQuizeByIdQuery,
} from "../../../features/quizes/quizeApi";

import {
  useGetVideosQuery,
  useGetVideoByIdQuery,
} from "../../../features/videos/videoApi";

export default function QuizEditModal({ showModal, setShowModal, qzId }) {
  const { data: quiz } = useGetQuizeByIdQuery(qzId);

  const [question, setQuestion] = useState("");
  const [videoObj, setVideoObj] = useState({});
  const [optionAans, setOptionAans] = useState("");
  const [optionAture, setOptionAtrue] = useState(false);
  const [optionBans, setOptionBans] = useState("");
  const [optionBture, setOptionBtrue] = useState(false);
  const [optionCans, setOptionCans] = useState("");
  const [optionCture, setOptionCtrue] = useState(false);
  const [optionDans, setOptionDans] = useState("");
  const [optionDture, setOptionDtrue] = useState(false);

  const { data: videos } = useGetVideosQuery();
  const [videoList, setVideoList] = useState([]);

  //   const { videoId, videoTitle } = videoObj || {};

  const { question: initialQuestion, options: initialOptions } = quiz || {};

  const { data: video } = useGetVideoByIdQuery(quiz?.video_id);

  useEffect(() => {
    if (quiz?.id && video?.id) {
      setQuestion(initialQuestion);
      setVideoObj(video);
      setOptionAans(initialOptions[0].option);
      setOptionAtrue(initialOptions[0].isCorrect);
      setOptionBans(initialOptions[1].option);
      setOptionBtrue(initialOptions[1].isCorrect);
      setOptionCans(initialOptions[2].option);
      setOptionCtrue(initialOptions[2].isCorrect);
      setOptionDans(initialOptions[3].option);
      setOptionDtrue(initialOptions[3].isCorrect);
    }
  }, [initialOptions, initialQuestion, quiz?.id, video]);

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

  const quizData = {
    question: question,
    video_id: videoObj?.id,
    video_title: videoObj.title,
    options: [
      {
        id: 1,
        option: optionAans,
        isCorrect: Boolean(optionAture),
      },
      {
        id: 2,
        option: optionBans,
        isCorrect: Boolean(optionBture),
      },
      {
        id: 3,
        option: optionCans,
        isCorrect: Boolean(optionCture),
      },
      {
        id: 4,
        option: optionDans,
        isCorrect: Boolean(optionDture),
      },
    ],
  };

  const [editQuize, { isLoading, isError, isSuccess }] = useEditQuizeMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false);
    }
  }, [isSuccess, setShowModal]);

  const submitVideo = (e) => {
    e.preventDefault();
    if (question !== "") {
      editQuize({
        id: qzId,
        data: quizData,
      });
      //   console.log(quizData);
    }
  };

  let errorText = null;

  if (!isLoading && isError) errorText = <p>There is an error</p>;

  return (
    <>
      {showModal ? (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none popup-overlay">
          <div className="relative w-auto my-6 mx-auto max-w-3xl p-5">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">
                  {qzId ? "Edit Quiz" : "Add Quiz"}
                </h3>
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    x
                  </span>
                </button>
              </div>
              <h1>Quiz for lesson</h1>
              <div className="mx-auto lwspopup-form px-5 lg:px-0">
                <form className="mt-8 space-y-6" onSubmit={submitVideo}>
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
                        Quize Question
                      </label>
                      <input
                        id="quize-question"
                        name="quiestion"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="quize question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="optionAAnswere" className="sr-only">
                        Option a Answere
                      </label>
                      <input
                        id="optionAAnswere"
                        name="optionAAnswere"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="option A Answere"
                        value={optionAans}
                        onChange={(e) => setOptionAans(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        name="OpAtrue"
                        className="login-input"
                        value={optionAture}
                        onChange={(e) => setOptionAtrue(e.target.value)}
                      >
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="optionBAnswere" className="sr-only">
                        Option b Answere
                      </label>
                      <input
                        id="optionBAnswere"
                        name="optionBAnswere"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="option B Answere"
                        value={optionBans}
                        onChange={(e) => setOptionBans(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        name="OpBtrue"
                        className="login-input"
                        value={optionBture}
                        onChange={(e) => setOptionBtrue(e.target.value)}
                      >
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="optionCAnswere" className="sr-only">
                        Option C Answere
                      </label>
                      <input
                        id="optionCAnswere"
                        name="optionCAnswere"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="option C Answere"
                        value={optionCans}
                        onChange={(e) => setOptionCans(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        name="OpCtrue"
                        className="login-input"
                        value={optionCture}
                        onChange={(e) => setOptionCtrue(e.target.value)}
                      >
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="optionDAnswere" className="sr-only">
                        Option d Answere
                      </label>
                      <input
                        id="optionDAnswere"
                        name="optionDAnswere"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="option D Answere"
                        value={optionDans}
                        onChange={(e) => setOptionDans(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        name="OpDtrue"
                        className="login-input"
                        value={optionDture}
                        onChange={(e) => setOptionDtrue(e.target.value)}
                      >
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                      Submit Quize
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
