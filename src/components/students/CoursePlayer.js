import { useEffect, useState } from "react";
import { useGetVideosQuery } from "../../features/videos/videoApi";
import VideoList from "./VideoList";
import VideoPlayer from "./VideoPlayer";
// import QuizeModal from "./QuizeModal";
import AssignmentModal from "./AssignmentModal";
import Quiz from "./Quiz";

export default function CoursePlayer() {
  const { data: videos, isLoading, isError } = useGetVideosQuery();
  const [videoId, setVideoId] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  // const [studentQuizSubmitted, setStudentQuizSubmitted] = useState(false);

  useEffect(() => {
    if (videos?.length > 0) {
      setVideoId(videos[0].id);
    }
  }, [videos]);

  let sideVideos = null;

  if (isLoading) {
    sideVideos = <p>Loading...</p>;
  }

  if (!isLoading && isError) {
    sideVideos = <p>There was an error</p>;
  }

  if (!isLoading && !isError && videos?.length === 0) {
    sideVideos = <p>There is no video</p>;
  }

  if (!isLoading && !isError && videos?.length > 0) {
    sideVideos = videos.map((video) => (
      <VideoList videoDetails={video} key={video.id} pushVideoId={setVideoId} />
    ));
  }

  let playerContent = null;

  if (videoId > 0) {
    playerContent = (
      <VideoPlayer
        videoId={videoId}
        setShowModal={setShowModal}
        setShowAssignmentModal={setShowAssignmentModal}
        // studentQuizSubmitted={studentQuizSubmitted}
      />
    );
  }

  return (
    <>
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-7xl px-5 lg:px-0">
          <div className="grid grid-cols-3 gap-2 lg:gap-8">
            {playerContent}
            <div className="col-span-full lg:col-auto max-h-[570px] overflow-y-auto bg-secondary p-4 rounded-md border border-slate-50/10 divide-y divide-slate-600/30">
              {sideVideos}
            </div>
          </div>
        </div>
      </section>
      {/* <QuizeModal showModal={showModal} setShowModal={setShowModal} /> */}
      <Quiz showModal={showModal} setShowModal={setShowModal} />
      <AssignmentModal
        showAssignmentModal={showAssignmentModal}
        setShowAssignmentModal={setShowAssignmentModal}
      />
    </>
  );
}
