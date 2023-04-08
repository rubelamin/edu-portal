import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAssignmentSubmittedListQuery } from "../../features/assignment/assignmentApi";
import { useDispatch, useSelector } from "react-redux";
import { submittedListArr } from "../../features/assignment/assignmentSlice";
import SubmittedList from "./assignment/SubmittedList";

export default function AssignmentMark() {
  const {
    data: submittedList,
    isLoading,
    isError,
  } = useGetAssignmentSubmittedListQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !isError) {
      dispatch(submittedListArr(submittedList));
    }
  }, [dispatch, isError, isLoading, submittedList]);

  const allSubmittedList =
    useSelector((state) => state.assignments.assignmentSubmittedList) || [];

  let submittedContent = null;

  if (allSubmittedList?.length) {
    submittedContent = allSubmittedList.map((li) => (
      <SubmittedList details={li} />
    ));
  }

  // calculation
  const totalAssignment = () => {
    const result = allSubmittedList?.length;
    return result;
  };

  const pendingMark = () => {
    const pending = allSubmittedList.filter(
      (item) => item.status === "pending"
    );
    return pending.length;
  };

  const markSent = () => {
    const sent = totalAssignment() - pendingMark();

    return sent;
  };

  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-full px-5 lg:px-20">
        <div className="px-3 py-20 bg-opacity-10">
          <div className="w-full flex">
            <Link to="/admin/dashboard" className="btn ">
              Back to Dashboard
            </Link>

            <ul className="assignment-status ml-auto">
              <li>
                Total <span>{totalAssignment()}</span>
              </li>
              <li>
                Pending <span>{pendingMark()}</span>
              </li>
              <li>
                Mark Sent <span>{markSent()}</span>
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="divide-y-1 text-base divide-gray-600 w-full">
              <thead>
                <tr>
                  <th className="table-th">Assignment</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Student Name</th>
                  <th className="table-th">Repo Link</th>
                  <th className="table-th">Mark</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-600/50">
                {submittedContent}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
