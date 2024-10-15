import moviesService from "@/services/moviesService";
import { ArrowLeft, Bookmark, BookmarkCheck, Eye, EyeOff } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

function DetailsMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [listed, setListed] = useState(false);
  const [watched, setWatched] = useState(false);
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const width = useWindowSize();

  useEffect(() => {
    const fetchMovieStatus = async () => {
      try {
        const isListed = await moviesService.isMovieSaved(movieId, "listed");
        const isWatched = await moviesService.isMovieSaved(movieId, "watched");
        setListed(isListed);
        setWatched(isWatched);
      } catch (error) {
        console.error("Error fetching movie status:", error);
      }
    };
  
    fetchMovieStatus();
  }, [movieId]);

  const handleSave = async (type) => {
    try {
      const isSaved = await moviesService.isMovieSaved(movieId, type);
      if (isSaved) {
        await moviesService.removeSavedMovie(movieId, type);
        type === "listed" ? setListed(false) : setWatched(false);
        console.log("Movie removed from", type);
      } else {
        await moviesService.saveMovie(movieId, type);
        type === "listed" ? setListed(true) : setWatched(true);
        console.log("Movie saved to", type);
      }
    } catch (error) {
      console.error("Error handling movie save:", error);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovie(movieId);
      if (movieData.error) {
        console.error("Error fetching movie:", movieData.error);
        setError(movieData.error);
      } else {
        setMovie(movieData.data || []);
        const movieVideos = await getMovieVideos(movieId);
        if (movieVideos.error) {
          console.error("Error fetching videos:", movieVideos.error);
          setError(movieVideos.error);
        } else {
          setVideos(movieVideos.data || []);
        }
      }
    };

    fetchMovie();
  }, [movieId]);
  return (
    <main className="bg-background flex flex-1 flex-grow flex-col">
      {console.log("Movie:", movie)}
      <section>
        <div
          style={{
            backgroundImage: `url(${
              import.meta.env.VITE_API_IMAGE_URL
            }original${movie?.backdrop_path})`,
          }}
          className="bg-cover bg-no-repeat"
        >
          <div className="bg-gradient-to-t from-background flex items-center flex-col justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{
                minHeight:
                  width < 768 ? (width / 16) * 9 : (((width / 4) * 3) / 16) * 9,
              }}
            >
              {videos && videos.results.length > 0 && (
                <iframe
                  width={width < 768 ? width : (width / 4) * 3}
                  height={
                    width < 768
                      ? (width / 16) * 9
                      : (((width / 4) * 3) / 16) * 9
                  }
                  src={`https://www.youtube.com/embed/${
                    filterVideo(videos.results).key
                  }`}
                  title={movie?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <button
              className="text-text size-12 lg:size-16 absolute top-4 left-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-full h-full" />
            </button>
          </div>
        </div>
      </section>
      <section className="p-6 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row items-start justify-between">
          <div>
            <h1 className="text-text font-bold text-3xl lg:text-4xl selection:bg-black">
              {movie?.title}
            </h1>
            <p className="text-text font-medium text-md lg:text-lg selection:bg-black">
              {new Date(movie?.release_date).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} - {movie?.runtime} min {movie?.origin_country && <span>- <img className="w-6 lg:w-7 -mt-1 lg:-mt-0.5 inline-block" src={`https://flagsapi.com/${movie?.origin_country}/flat/32.png`} /></span>}
            </p>
          </div>
          <div className="flex flex-row-reverse lg:flex-row gap-6 text-text">
            {listed ? (
              <BookmarkCheck
                className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
                onClick={() => handleSave("listed")}
              />
            ) : (
              <Bookmark
                className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
                onClick={() => handleSave("listed")}
              />
            )}
            {watched ? (
              <Eye
                className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
                onClick={() => handleSave("watched")}
              />
            ) : (
              <EyeOff
                className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
                onClick={() => handleSave("watched")}
              />
            )}
            <div className="flex items-center text-xl lg:text-[26px] -mt-0.5 lg:-mt-1 font-semibold text-yellow-400">
              <p className="mr-2 selection:bg-black">
                {movie?.vote_count > 0
                  ? movie?.vote_average.toFixed(2) + "/10"
                  : "N/A"}
              </p>
              <FaStar className="size-8 mb-1" />
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-text my-4">
          {movie?.genres?.map((genre) => (
            <p
              key={genre.id}
              className="bg-black/30 p-2 px-4 rounded-full hover:scale-110 transition-transform select-none"
            >
              {genre.name}
            </p>
          ))}
        </div>
        <p className="text-text text-md lg:text-lg text-justify selection:bg-black">
          {movie?.overview}
        </p>
      </section>
      <ScrollRestoration />
    </main>
  );
}

const getMovie = async (id) => {
  return await moviesService.getMovieDetails(id);
};

const getMovieVideos = async (id) => {
  return await moviesService.getMovieVideos(id);
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

export default DetailsMovie;
