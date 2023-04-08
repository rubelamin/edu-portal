import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AssignmentItem from "./assignment/AssignmentItem";
import { useGetAssignmentsQuery } from "../../features/assignment/assignmentApi";
import AddAssignmentModal from "./assignment/AddAssignmentModal";
import { useDispatch, useSelector } from "react-redux";
import { assignmentArr } from "../../features/assignment/assignmentSlice";

export default function Assignment() {
  const [showModal, setShowModal] = useState(false);
  const [assignmentId, setAssignmentId] = useState(null);

  const {
    data: assignment,
    isLoading,
    isError,
    isSuccess,
  } = useGetAssignmentsQuery();
  const assignmentsList = useSelector(
    (state) => state.assignments.assignmentList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(assignmentArr(assignment));
    }
  }, [assignment, dispatch, isSuccess]);

  let assignmentContent = null;

  if (isLoading) assignmentContent = <p>Assignments is loading....</p>;

  if (!isLoading && isError)
    assignmentContent = <p>There is an error to load assignment</p>;

  if (!isLoading && !isError && !assignmentsList?.length) {
    assignmentContent = <p>There is no assignment.</p>;
  }

  if (!isLoading && !isError && assignmentsList?.length) {
    assignmentContent = assignmentsList.map((as, i) => (
      <AssignmentItem
        asDetails={as}
        setShowModal={setShowModal}
        assignId={setAssignmentId}
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
              <button
                onClick={() => setShowModal(true)}
                className="btn ml-auto"
              >
                Add Assignment
              </button>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="divide-y-1 text-base divide-gray-600 w-full">
                <thead>
                  <tr>
                    <th className="table-th">Title</th>
                    <th className="table-th">Video Title</th>
                    <th className="table-th">Mark</th>
                    <th className="table-th">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-600/50">
                  {isLoading || isError ? (
                    <tr>
                      <td>{assignmentContent}</td>
                    </tr>
                  ) : (
                    assignmentContent
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <AddAssignmentModal
        showModal={showModal}
        setShowModal={setShowModal}
        asId={assignmentId}
        setAssignmentId={setAssignmentId}
      />
    </>
  );
}
