import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useEditVideoMutation,
  useGetVideoByIdQuery,
} from "../../features/videos/videoApi";

export default function EditVideo() {
  const params = useParams();
  const { videoId } = params || {};
  const { data: video } = useGetVideoByIdQuery(videoId);
  const {
    title: initialTitle,
    description: initialDescription,
    url: initialUrl,
    views: initialViews,
    duration: initialDuration,
  } = video || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [views, setViews] = useState("");
  const [duration, setDuration] = useState("");

  const [editVideo, { isLoading, isError, isSuccess }] = useEditVideoMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (video?.id) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setUrl(initialUrl);
      setViews(initialViews);
      setDuration(initialDuration);
    }
  }, [
    video?.id,
    initialDescription,
    initialTitle,
    initialDuration,
    initialUrl,
    initialViews,
  ]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin/videos");
    }
  }, [isSuccess, navigate]);

  const submitVideo = (e) => {
    e.preventDefault();
    if (
      title !== "" &&
      description !== "" &&
      url !== "" &&
      views !== "" &&
      duration !== ""
    ) {
      editVideo({
        id: videoId,
        data: {
          title,
          description,
          url,
          views,
          duration,
        },
      });
    }
  };

  let errorText = null;

  if (!isLoading && isError) errorText = <p>There is an error</p>;

  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto lwsall-form px-5 lg:px-0">
        <div className="w-full flex">
          <Link to="/admin/videos" className="btn ">
            Back to Videos
          </Link>
        </div>
        <form className="mt-8 space-y-6" onSubmit={submitVideo}>
          <div className="rounded-md shadow-sm form-element -space-y-px">
            <div>
              <label htmlFor="video-title" className="sr-only">
                Video Title
              </label>
              <input
                id="video-title"
                name="title"
                type="text"
                required
                className="login-input rounded-t-md"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="video-description" className="sr-only">
                Video Description
              </label>
              <textarea
                id="video-description"
                name="description"
                type="text"
                rows={6}
                required
                className="login-input rounded-t-md"
                placeholder="Video Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="video-url" className="sr-only">
                Video Url
              </label>
              <input
                id="video-url"
                name="url"
                type="text"
                required
                className="login-input rounded-t-md"
                placeholder="Youtube Video Id e.g: GY7E4Eurb0Q"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="video-views" className="sr-only">
                Video Views
              </label>
              <input
                id="video-views"
                name="views"
                type="text"
                required
                className="login-input rounded-t-md"
                placeholder="Views e.g: 12.5k"
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="video-duration" className="sr-only">
                Video duration
              </label>
              <input
                id="video-duration"
                name="duration"
                type="text"
                required
                className="login-input rounded-t-md"
                placeholder="duration e.g: 8:31"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Submit Video
            </button>
          </div>
          <div>{errorText}</div>
        </form>
      </div>
    </section>
  );
}
