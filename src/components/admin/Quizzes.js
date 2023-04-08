import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetAllQuizesQuery } from "../../features/quizes/quizeApi";
import { addQuizeListed } from "../../features/quizes/quizeSlice";
import QuizeItem from "./quize/QuizeItem";
import QuizEditModal from "./quize/QuizEditModal";

export default function Quizzes() {
  const { data: quizes, isSuccess } = useGetAllQuizesQuery();
  const quizArr = useSelector((state) => state.quizes.quizesList);

  const [showModal, setShowModal] = useState(false);
  const [quizId, setQuizId] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(addQuizeListed(quizes));
    }
  }, [quizes, isSuccess, dispatch]);

  let quizContent = null;
  let deleteAction = null;

  if (!quizArr?.length && !deleteAction) quizContent = <p>There is no quize</p>;

  if (!quizArr?.length && deleteAction)
    quizContent = <p>Quiz deleting and re-serializing...</p>;

  if (quizArr?.length && !deleteAction) {
    quizContent = quizArr.map((q, i) => (
      <QuizeItem
        quizDetails={q}
        qnumber={i}
        key={q.id}
        qzDeltLoading={deleteAction}
        setShowModal={setShowModal}
        setQuizId={setQuizId}
      />
    ));
  }

  return (
    <>
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-full px-5 lg:px-20">
          <div className="px-3 py-20 bg-opacity-10">
            <div className="w-full flex">
              <Link to="/admin/dashboard" className="btn ">
                Back to Dashboard
              </Link>
              <Link to="/admin/addquize" className="btn ml-auto">
                Add Quiz
              </Link>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="divide-y-1 text-base divide-gray-600 w-full">
                <thead>
                  <tr>
                    <th className="table-th">Question</th>
                    <th className="table-th">Video</th>
                    <th className="table-th justify-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-600/50">
                  {quizContent}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <QuizEditModal
        showModal={showModal}
        setShowModal={setShowModal}
        qzId={quizId}
      />
    </>
  );
}
