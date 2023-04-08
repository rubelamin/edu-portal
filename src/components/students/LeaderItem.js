import React from "react";

export default function LeaderItem({ studentDetails }) {
  const {
    student_name: name,
    quizMark,
    assMark,
    allMark,
    rank,
  } = studentDetails || {};
  return (
    <tr className="border-b border-slate-600/50">
      <td className="table-td text-center">{rank}</td>
      <td className="table-td text-center">{name}</td>
      <td className="table-td text-center">{quizMark}</td>
      <td className="table-td text-center">{assMark}</td>
      <td className="table-td text-center">{allMark}</td>
    </tr>
  );
}
