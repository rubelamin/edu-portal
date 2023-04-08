import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddQuizeMutation } from "../../../features/quizes/quizeApi";
import { useGetVideosQuery } from "../../../features/videos/videoApi";

export default function AddQuize() {
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

  const [addQuize, { isLoading, isError, isSuccess }] = useAddQuizeMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin/quizzes");
    }
  }, [isSuccess, navigate]);

  const submitVideo = (e) => {
    e.preventDefault();
    if (question !== "") {
      addQuize(quizData);
      //   console.log(quizData);
    }
  };

  let errorText = null;

  if (!isLoading && isError) errorText = <p>There is an error</p>;

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto lwsall-form px-5 lg:px-0">
        <div className="w-full flex">
          <Link to="/admin/quizzes" className="btn ">
            Back to Quizzes
          </Link>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitVideo}>
          <div className="rounded-md shadow-sm form-element -space-y-px">
            <div>
              <select
                name="videoObj"
                className="login-input"
                value={videoObj}
                onChange={(e) => setVideoObj(JSON.parse(e.target.value))}
              >
                <option value={videoObj}>
                  {videoObj?.title ? videoObj.title : "Select Video"}
                </option>
                {videoList?.length &&
                  videoList.map((video) => (
                    <option value={JSON.stringify(video)} key={video.id}>
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
              Submit Video
            </button>
          </div>
          <div>{errorText}</div>
        </form>
      </div>
    </section>
  );
}
