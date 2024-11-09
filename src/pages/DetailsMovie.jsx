import MoviesService from "@/services/MoviesService";
import { ArrowLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ScrollRestoration, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TrailerIframe } from "@/components/trailer-iframe";
import { MovieActions } from "@/components/movie-actions";
import { ErrorDialog } from "@/components/error-dialog";
import { WatchProviders } from "@/components/watch-providers";
import { Loading } from "@/components/loading";

function DetailsMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovie(movieId);
      if (movieData.error) {
        console.error("Error fetching movie:", movieData.error);
        setError(movieData.error);
      }
      setMovie(movieData.data || []);
      setLoading(false);
    };
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="bg-cyan-800 flex flex-1 flex-grow flex-col">
      {error && (
        <ErrorDialog
          error={error}
          title={"Erro ao carregar informações do filme"}
        />
      )}
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
            <TrailerIframe movieId={movieId} />
            <button
              className="text-text size-12 lg:size-16 absolute top-4 left-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-full h-full" />
            </button>
          </div>
        </div>
      </section>
      <section className="px-6 mb-4 pt-6 lg:pt-12 lg:px-12">
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
              })}{" "}
              - {movie?.runtime} min{" "}
              {movie?.origin_country ? (
                <span>
                  -{" "}
                  <img
                    className="w-6 lg:w-7 -mt-1 lg:-mt-0.5 inline-block"
                    src={`https://flagsapi.com/${movie?.origin_country}/flat/32.png`}
                    alt={`Bandeira de ${movie?.origin_country}`}
                  />
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-row-reverse lg:flex-row gap-6 text-text">
            <MovieActions movieId={movieId} />
            <div className="flex items-center text-2xl lg:text-[26px] -mt-0.5 lg:-mt-1 font-semibold text-yellow-400">
              <p className="mr-2 selection:bg-black">
                {movie?.vote_count > 0
                  ? movie?.vote_average.toFixed(2) + "/10"
                  : "N/A"}
              </p>
              <FaStar size={32} className="mb-1" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-text my-4">
          {movie?.genres?.map((genre) => (
            <span
              key={genre.id}
              className="bg-black/30 p-2 px-4 rounded-full hover:scale-110 transition-transform select-none"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <p className="text-text text-md lg:text-lg text-justify selection:bg-black">
          {movie?.overview}
        </p>
        <WatchProviders id={movieId} />
      </section>
      <ScrollRestoration />
    </main>
  );
}

const getMovie = async (id) => {
  return await MoviesService.getMovieDetails(id);
};

export default DetailsMovie;
