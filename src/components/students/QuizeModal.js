import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSubmitQuizeMutation } from "../../features/quizes/quizeApi";
import QuizeList from "./QuizeList";

export default function QuizeModal({ showModal, setShowModal }) {
  const quizes = useSelector((state) => state.quizes.videoQuize);
  const user = useSelector((state) => state.auth.user);
  const { id: userId, name: userName } = user || {};
  const video = useSelector((state) => state.videos.videos);
  const { id: videoId, title: videoTitle } = video || {};
  const [submitQuize, { isLoading, isError, isSuccess }] =
    useSubmitQuizeMutation();

  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (showModal === false) {
      setCurrentQuestion(0);
    }
  }, [showModal]);

  const optionChecked = (isCorrect) => {
    if (isCorrect) {
      if (score >= 0) {
        setScore(score + 5);
      }
    } else {
      setScore(0);
    }
    console.log(score);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizes?.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  const prevQuestion = () => {
    if (quizes?.length !== 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setShowResults(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = formData.entries();
    for (const entry of data) console.log(entry);

    const quizData = {
      student_id: userId,
      student_name: userName,
      video_id: videoId,
      video_title: videoTitle,
      totalQuiz: quizes?.length,
      totalCorrect: 1,
      totalWrong: 1,
      totalMark: quizes?.length * 5,
      mark: 5,
    };

    submitQuize(quizData);
  };

  let afterText = null;
  if (isLoading) afterText = <p>Loading...</p>;
  if (!isLoading && isError) afterText = <p>There is an error.</p>;
  if (!isLoading && !isError && isSuccess) {
    afterText = <p>Submited success</p>;
    console.log(showResults);
  }

  return (
    <>
      {showModal ? (
        <>
          <div
            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              background: "#1e293bbf",
              height: `100vh`,
            }}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl p-5">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">General Info</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <section className="py-6 bg-primary">
                  <div className="mx-auto max-w-7xl px-5 lg:px-0">
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold">
                        Quizzes for "Debounce Function in JavaScript -
                        JavaScript Job Interview question"
                      </h1>
                      <p className="text-sm text-slate-200">
                        Each question contains 5 Mark
                      </p>
                    </div>

                    <div className="space-y-8 ">
                      <div className="quiz ">
                        <h4 className="question">
                          Quiz - {currentQuestion + 1}{" "}
                          {quizes[currentQuestion].question}
                        </h4>
                        <form className="quizOptions" onSubmit={handleSubmit}>
                          {quizes?.length > 0
                            ? quizes[currentQuestion].options.map((quiz) => (
                                <QuizeList
                                  quizDetails={quiz}
                                  key={quiz.id}
                                  qnumber={currentQuestion + 1}
                                  opChecked={optionChecked}
                                />
                              ))
                            : "There is no quize"}

                          {currentQuestion + 1 === quizes?.length && (
                            <button
                              disabled={isLoading}
                              type="submit"
                              className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
                            >
                              Submit
                            </button>
                          )}

                          {afterText}
                        </form>
                      </div>
                    </div>

                    {currentQuestion !== 0 && (
                      <button
                        type="button"
                        onClick={prevQuestion}
                        className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
                      >
                        Prev
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
                    >
                      Next
                    </button>
                  </div>
                </section>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
