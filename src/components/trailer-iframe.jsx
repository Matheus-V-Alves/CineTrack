import MoviesService from "@/services/MoviesService";
import { useEffect, useLayoutEffect, useState } from "react";
import { ErrorDialog } from "./error-dialog";
import { Loading } from "./loading";

function useWindowSize() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return width;
}

export const TrailerIframe = ({ movieId }) => {
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const width = useWindowSize();

  useEffect(() => {
    const fetchVideos = async () => {
      const videosData = await getMovieVideos(movieId);
      if (videosData.error) {
        console.error("Error fetching videos:", videosData.error);
        setError(videosData.error);
      }
      setVideos(videosData.data || []);
      setLoading(false);
    };
    fetchVideos();
  }, [movieId]);

  if (loading) {
    return <Loading transparent={true} />;
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        minHeight:
          width < 768 ? (width / 16) * 9 : (((width / 4) * 3) / 16) * 9,
      }}
    >
      {error ? (
        <ErrorDialog title="Erro ao carregar o trailer" error={error} />
      ) : (
        videos &&
        videos.results.length > 0 && (
          <iframe
            width={width < 768 ? width : (width / 4) * 3}
            height={
              width < 768 ? (width / 16) * 9 : (((width / 4) * 3) / 16) * 9
            }
            src={`https://www.youtube.com/embed/${
              filterVideo(videos.results).key
            }`}
            title={filterVideo(videos.results).name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )
      )}
    </div>
  );
};

const getMovieVideos = async (id) => {
  return await MoviesService.getMovieVideos(id);
};

const filterVideo = (videos) => {
  let trailers = videos.filter((video) => video.type === "Trailer");
  trailers = trailers.filter(
    (video) => video.name === "Trailer Oficial Dublado"
  );
  if (trailers.length > 0) {
    return trailers[0];
  }
  return videos[0];
};
