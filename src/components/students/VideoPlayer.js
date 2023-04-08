import React, { useEffect, useState } from "react";
import { useGetVideoByIdQuery } from "../../features/videos/videoApi";
import moment from "moment";
import {
  useCheckQuizIsSubmitQuery,
  useGetQuizesQuery,
} from "../../features/quizes/quizeApi";
import { useDispatch, useSelector } from "react-redux";
import { quizeArr, quizeChecked } from "../../features/quizes/quizeSlice";
import { loadedVideo } from "../../features/videos/videoSlice";
import {
  useCheckAssignmentIsSubmitQuery,
  useGetAssignmentsByVideoIdQuery,
} from "../../features/assignment/assignmentApi";
import { assignmentArr } from "../../features/assignment/assignmentSlice";
import { isQuizSubmitted as quizSubmitting } from "../../features/quizes/quizeSlice";

export default function VideoPlayer({
  videoId,
  setShowModal,
  setShowAssignmentModal,
  // studentQuizSubmitted,
}) {
  const { data: video } = useGetVideoByIdQuery(videoId || 1);
  const { data: quizes, isLoading, isError } = useGetQuizesQuery(videoId || 1);
  const {
    data: assignment,
    isLoading: assLoading,
    isError: assError,
  } = useGetAssignmentsByVideoIdQuery(videoId || 1) || [];

  const assignmentState = useSelector(
    (state) => state.assignments.assignmentList
  );

  const hasQuize = useSelector((state) => state.quizes.hasQuizes);
  const quizChecker = useSelector((state) => state.quizes.quizeSubmitted);
  const dispatch = useDispatch();

  const [videoQuize, setVideoQuize] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQuizSubmitted, setQuizIsSubmitted] = useState(false);

  const studentDetails = useSelector((state) => state.auth.user) || {};

  useEffect(() => {
    if (!assLoading && !assError && assignment?.length) {
      dispatch(assignmentArr(assignment));
    }
  }, [assError, assLoading, assignment, dispatch]);

  let assId = null;
  if (assignmentState?.length) {
    assId = assignmentState[0].id;
  }

  const {
    data: assignmentSubmitted,
    isLoading: checkLoading,
    isError: checkError,
  } = useCheckAssignmentIsSubmitQuery({
    assignment_id: assId,
    student_id: studentDetails?.id,
  });

  useEffect(() => {
    if (!checkLoading && !checkError && assignmentSubmitted?.length) {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
    }
  }, [assignmentSubmitted?.length, checkError, checkLoading]);

  const {
    data: quizSubmitted,
    isLoading: quizLoading,
    isError: quizError,
  } = useCheckQuizIsSubmitQuery({
    video_id: videoId,
    student_id: studentDetails?.id,
  });

  useEffect(() => {
    if (quizSubmitted?.length) {
      setQuizIsSubmitted(true);
      dispatch(quizSubmitting(undefined));
      dispatch(quizSubmitting(true));
    } else {
      setQuizIsSubmitted(false);
      dispatch(quizSubmitting(undefined));
      dispatch(quizSubmitting(false));
    }
  }, [quizError, quizLoading, quizSubmitted, dispatch, videoId]);

  console.log(quizChecker);

  const { title, description, url, createdAt } = video || {};

  useEffect(() => {
    dispatch(loadedVideo(video));
  }, [dispatch, video]);

  useEffect(() => {
    if (!isLoading && !isError) {
      setVideoQuize((prev) => quizes);
      // dispatch(quizeArr(quizes));
    }
  }, [isLoading, isError, quizes]);

  useEffect(() => {
    if (videoQuize?.length > 0) {
      dispatch(quizeArr(videoQuize));
      dispatch(quizeChecked(true));
    } else {
      dispatch(quizeArr([]));
      dispatch(quizeChecked(false));
    }
  }, [videoQuize, dispatch]);

  return (
    <div className="col-span-full w-full space-y-8 lg:col-span-2">
      <iframe
        width="100%"
        className="aspect-video"
        src={`https://www.youtube.com/embed/${url}?autoplay=1`}
        title={title}
        border="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        autoPlay
      ></iframe>

      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-100">
          {title}
        </h1>
        <h2 className=" pb-4 text-sm leading-[1.7142857] text-slate-400">
          Uploaded on {moment(createdAt).format("LL")}
        </h2>

        <div className="flex gap-4">
          <button
            disabled={assignment?.length ? (isSubmitted ? true : false) : true}
            onClick={() => setShowAssignmentModal(true)}
            className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
          >
            {assignment?.length
              ? isSubmitted
                ? "এসাইনমেন্ট জমা দেওয়া হয়েছে "
                : "এসাইনমেন্ট আছে"
              : "এসাইনমেন্ট নেই"}
          </button>

          <button
            disabled={
              hasQuize === true
                ? isQuizSubmitted === true
                  ? true
                  : false
                : true
            }
            onClick={() => setShowModal(true)}
            className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
          >
            {/* {hasQuize ? "কুইজে অংশগ্রহণ করুন" : "কুইজ নেই"} */}
            {hasQuize === true
              ? isQuizSubmitted === true
                ? "কুইজ জমা দেওয়া হয়েছে "
                : "কুইজে অংশগ্রহণ করুন"
              : "কুইজ নেই"}
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400 leading-6">{description}</p>
      </div>
    </div>
  );
}
