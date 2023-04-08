import React, { useState, useEffect } from "react";
import Answers from "./quizzes/Answers";
import { useDispatch, useSelector } from "react-redux";
import { useSubmitQuizeMutation } from "../../features/quizes/quizeApi";
import _ from "lodash";
import {
  answerReducer,
  isQuizSubmitted,
  optionReducer,
} from "../../features/quizes/quizeSlice";
import { useNavigate } from "react-router-dom";

export default function Quiz({
  showModal,
  setShowModal,
  // setStudentQuizSubmitted,
}) {
  const questions = useSelector((state) => state.quizes.videoQuize);
  const user = useSelector((state) => state.auth.user);
  const { id: userId, name: userName } = user || {};
  const video = useSelector((state) => state.videos.videos);
  const { id: videoId, title: videoTitle } = video || {};

  const navigate = useNavigate();

  const [submitQuize, { isLoading, isError, isSuccess }] =
    useSubmitQuizeMutation();

  const dispatch = useDispatch();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (questions?.length) {
      dispatch(
        optionReducer({
          value: questions,
        })
      );
    }
  }, [questions, dispatch]);

  function handleAnswerChange(e, index) {
    dispatch(
      answerReducer({
        questionID: currentQuestion,
        optionIndex: index,
        value: e.target.checked,
      })
    );
  }

  const handleSubmit = () => {
    const quizData = {
      student_id: userId,
      student_name: userName,
      video_id: videoId,
      video_title: videoTitle,
      totalQuiz: questions?.length,
      totalCorrect: quizScore / 5,
      totalWrong: questions?.length - quizScore / 5,
      totalMark: questions?.length * 5,
      mark: quizScore,
    };

    submitQuize(quizData);
  };
  if (isSuccess && !isError && !isLoading) {
    dispatch(isQuizSubmitted(true));
    navigate("/LeaderBoard");
  }

  function nextQuestion() {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevCurrent) => prevCurrent + 1);
    }
  }

  function prevQuestion() {
    if (currentQuestion >= 1 && currentQuestion <= questions.length) {
      setCurrentQuestion((prevCurrent) => prevCurrent - 1);
    }
  }

  // calculate quiz score
  const checkedQuestions = useSelector((state) => state.quizes.quizOptions);
  const answeredQuestions = useSelector((state) => state.quizes.answerOptions);
  useEffect(() => {
    if (answeredQuestions?.length) {
      function calculate() {
        let score = 0;
        checkedQuestions.forEach((question, index1) => {
          let correctIndexes = [];
          let checkedIndexes = [];

          question?.options?.forEach((option, index2) => {
            if (option.isCorrect) correctIndexes.push(index2);
            if (answeredQuestions[index1]?.options[index2]?.checked) {
              checkedIndexes.push(index2);
              // option.checked = true;
            }
          });

          if (_.isEqual(correctIndexes, checkedIndexes)) {
            score = score + 5;
          }
          // console.log(correctIndexes);
          // console.log(checkedIndexes);
        });

        return score;
      }
      setQuizScore(calculate());
    }
  }, [checkedQuestions, questions, answeredQuestions]);

  return (
    <>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none popup-overlay">
            <div
              className="relative w-auto my-6 mx-auto max-w-3xl p-5"
              style={{ top: "5%" }}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">{videoTitle}</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right popup-closeBtn"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                {/* form body start  */}
                {answeredQuestions && answeredQuestions?.length && (
                  <div className="space-y-8 ">
                    <div className="quiz ">
                      <h4 className="question">
                        Quiz - {currentQuestion + 1}{" "}
                        {answeredQuestions[currentQuestion].question}
                      </h4>
                      <Answers
                        options={answeredQuestions[currentQuestion].options}
                        handleChange={handleAnswerChange}
                        questionNumber={currentQuestion}
                      />
                    </div>
                    <div className="flex flex-row py-1 mb-10">
                      {currentQuestion !== 0 && (
                        <button
                          type="button"
                          onClick={prevQuestion}
                          className="px-4 py-2 rounded-full bg-cyan block mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
                        >
                          Prev
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={
                          currentQuestion + 1 === questions?.length
                            ? handleSubmit
                            : nextQuestion
                        }
                        className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95 "
                      >
                        {currentQuestion + 1 === questions?.length
                          ? "Submit"
                          : "Next"}
                      </button>
                    </div>
                  </div>
                )}

                {/* form body end  */}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
