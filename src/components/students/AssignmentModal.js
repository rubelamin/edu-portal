import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAssignmentRepoSubmitMutation } from "../../features/assignment/assignmentApi";

export default function AssignmentModal({
  showAssignmentModal,
  setShowAssignmentModal,
}) {
  const [repoLink, setRepoLink] = useState("");

  const assignmentDetails = useSelector(
    (state) => state.assignments.assignmentList
  );

  const [assignmentRepoSubmit, { isLoading, isError, isSuccess }] =
    useAssignmentRepoSubmitMutation();

  const studentDetails = useSelector((state) => state.auth.user);

  const submitAssignment = (e) => {
    e.preventDefault();
    const data = {
      student_id: studentDetails?.id,
      student_name: studentDetails?.name,
      assignment_id: assignmentDetails?.[0].id,
      title: assignmentDetails?.[0].title,
      createdAt: Date.now(),
      totalMark: assignmentDetails?.[0].totalMark,
      mark: 0,
      repo_link: repoLink,
      status: "pending",
    };

    assignmentRepoSubmit(data);
  };

  if (isSuccess) {
    setShowAssignmentModal(false);
  }

  let msg = null;

  if (isLoading) msg = <p>Submitting...</p>;

  if (!isLoading && isError) msg = <p>There was an error.</p>;

  return (
    <>
      {showAssignmentModal ? (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none popup-overlay">
          <div className="relative w-auto my-6 mx-auto max-w-3xl p-5">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">
                  Submit Github Repo Link
                </h3>
                <button
                  className="bg-transparent border-0 text-black float-right popup-closeBtn"
                  onClick={() => setShowAssignmentModal(false)}
                >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    x
                  </span>
                </button>
              </div>
              <h1>Submit assignment github repo link </h1>
              <div className="mx-auto max-w-md px-5 lg:px-0">
                <form className="mt-8 space-y-6" onSubmit={submitAssignment}>
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="repolink" className="sr-only">
                        Github Repository Link
                      </label>
                      <input
                        id="repolink"
                        name="repolink"
                        type="text"
                        required
                        className="login-input rounded-t-md"
                        placeholder="Github Repo Link"
                        value={repoLink}
                        onChange={(e) => setRepoLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                      Submit Assignment
                    </button>
                  </div>
                  <div>{msg}</div>
                </form>
              </div>

              {/* end modal form content  */}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
