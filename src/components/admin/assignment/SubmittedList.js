import React, { useState } from "react";
import moment from "moment";
import { useSubmitMarkMutation } from "../../../features/assignment/assignmentApi";

export default function SubmittedList({ details }) {
  const [markValue, setMarkValue] = useState(100);

  const {
    id,
    title,
    createdAt,
    student_name,
    repo_link,
    mark,
    status,
    assignment_id,
    student_id,
    totalMark,
  } = details || {};

  const [submitMark, { isLoading, isError, isSuccess }] =
    useSubmitMarkMutation();

  const data = {
    student_id,
    student_name,
    assignment_id,
    title,
    createdAt,
    totalMark,
    mark: Number(markValue),
    repo_link,
    status: "published",
  };

  const handleMark = () => {
    submitMark({ id, data });
  };

  if (!isLoading && !isError && isSuccess) {
    console.log("Successfully updated marks!");
  }

  return (
    <tr>
      <td className="table-td">{title}</td>
      <td className="table-td">
        {moment(createdAt).format("MMMM DD YYYY, h:mm:ss a")}
      </td>
      <td className="table-td">{student_name}</td>
      <td className="table-td">{repo_link}</td>
      <td className="table-td input-mark">
        {status === "published" ? (
          mark
        ) : (
          <>
            <input
              max="100"
              value={markValue}
              onChange={(e) => setMarkValue(e.target.value)}
            />
            <svg
              onClick={handleMark}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </>
        )}
      </td>
    </tr>
  );
}
