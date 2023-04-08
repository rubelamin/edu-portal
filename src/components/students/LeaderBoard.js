import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllQuizeMarkQuery } from "../../features/quizes/quizeApi";
import { useGetAssignmentSubmittedListQuery } from "../../features/assignment/assignmentApi";
import LeaderItem from "./LeaderItem";

export default function LeaderBoard() {
  const auth = useSelector((state) => state.auth.user);
  const { id: student_id } = auth || {};

  const [allDoneAssignments, setAllDoneAssignments] = useState([]);
  const [AllQuizeMark, setAllQuizeMark] = useState([]);

  const { data: DoneAssignments } = useGetAssignmentSubmittedListQuery();
  const { data: DoneQuizeMark } = useGetAllQuizeMarkQuery();

  useEffect(() => {
    if (DoneAssignments?.length) {
      setAllDoneAssignments([]);
      setAllDoneAssignments(DoneAssignments);
    }
  }, [DoneAssignments]);

  useEffect(() => {
    if (DoneQuizeMark?.length) {
      setAllQuizeMark([]);

      setAllQuizeMark(DoneQuizeMark);
    }
  }, [DoneQuizeMark]);

  // calculation of assignment mark for each student and return new array
  let totalAssignmentMarks = [];
  if (allDoneAssignments?.length) {
    let counter = 1;
    totalAssignmentMarks = Object.values(
      allDoneAssignments.reduce((acc, { student_id, student_name, mark }) => {
        if (!acc[student_id]) {
          acc[student_id] = {
            id: counter++,
            student_id,
            student_name,
            mark: 0,
          };
        }
        acc[student_id].mark += mark;
        return acc;
      }, {})
    );
  }

  // calculation of quiz mark for each student and return new array
  let totalQuizeMarks = [];
  if (AllQuizeMark?.length) {
    let counter = 1;
    totalQuizeMarks = Object.values(
      AllQuizeMark.reduce((acc, { student_id, student_name, mark }) => {
        if (!acc[student_id]) {
          acc[student_id] = {
            id: counter++,
            student_id,
            student_name,
            mark: 0,
          };
        }
        acc[student_id].mark += mark;
        return acc;
      }, {})
    );
  }

  // below are the combined main array for dispalying leaderboard

  let latestCombined;
  if (totalAssignmentMarks?.length) {
    latestCombined = totalQuizeMarks
      .map((qzItem) => {
        const assItem = totalAssignmentMarks.find(
          (item) => item.student_id === qzItem.student_id
        ) || { mark: 0 };
        const { student_id, student_name } = qzItem;
        const assMark = assItem.mark || 0;
        const quizMark = qzItem.mark || 0;
        const allMark = assMark + quizMark;

        return {
          id: qzItem.id,
          student_id,
          student_name,
          assMark,
          quizMark,
          allMark,
        };
      })
      .concat(
        totalAssignmentMarks
          .filter(
            (item) =>
              !totalQuizeMarks.some(
                (qzItem) => qzItem.student_id === item.student_id
              )
          )
          .map(({ student_id, student_name, mark }) => ({
            student_id,
            student_name,
            assMark: mark,
            quizMark: 0,
            allMark: mark,
          }))
      );
  }

  //latest new combined array end

  let leaderArray;
  if (latestCombined?.length) {
    const sortbyAllmark = latestCombined.sort((a, b) => b.allMark - a.allMark);
    leaderArray = sortbyAllmark.map((ob, index) => ({
      ...ob,
      rank: index + 1,
    }));

    leaderArray.sort((a, b) => b.allMark - a.allMark);
    let rank = 0;
    let prevAllMark = null;
    leaderArray.forEach((obj) => {
      if (obj.allMark !== prevAllMark) {
        rank = rank + 1;
        prevAllMark = obj.allMark;
      }
      obj.rank = rank;
    });
  }

  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-7xl px-5 lg:px-0">
        <div>
          <h3 className="text-lg font-bold">Your Position in Leaderboard</h3>
          <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
            <thead>
              <tr>
                <th className="table-th !text-center">Rank</th>
                <th className="table-th !text-center">Name</th>
                <th className="table-th !text-center">Quiz Mark</th>
                <th className="table-th !text-center">Assignment Mark</th>
                <th className="table-th !text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {leaderArray?.length &&
                leaderArray
                  .filter((item) => item.student_id === student_id)
                  .map((item, i) => (
                    <LeaderItem studentDetails={item} key={i} />
                  ))}
            </tbody>
          </table>
        </div>

        <div className="my-8">
          <h3 className="text-lg font-bold">Top 20 Result</h3>
          <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
            <thead>
              <tr className="border-b border-slate-600/50">
                <th className="table-th !text-center">Rank</th>
                <th className="table-th !text-center">Name</th>
                <th className="table-th !text-center">Quiz Mark</th>
                <th className="table-th !text-center">Assignment Mark</th>
                <th className="table-th !text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {leaderArray?.length &&
                leaderArray
                  .filter((item) => item.student_id !== student_id)
                  .slice(0, 20)
                  .map((item, i) => (
                    <LeaderItem studentDetails={item} key={i} />
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
