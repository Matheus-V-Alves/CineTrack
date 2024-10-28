import { ErrorDialog } from "@/components/error-dialog";
import { Loading } from "@/components/loading";
import { MovieSection } from "@/components/movie-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import MoviesService from "@/services/MoviesService";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, ScrollRestoration } from "react-router-dom";

function Home() {
  const [movieCategories] = useState([
    { apiCall: "trending", title: "Em alta", pagination: true },
    { apiCall: "listed", title: "Sua Lista", pagination: false },
    { apiCall: "top_rated", title: "Melhor avaliados", pagination: true },
    { apiCall: "upcoming", title: "Chegando em breve", pagination: true },
    { apiCall: "now_playing", title: "Em cartaz", pagination: true },
    { apiCall: "watched", title: "Assistidos", pagination: false },
  ]);

  const [loading, setLoading] = useState(true);
  const [movieLists, setMovieLists] = useState([]);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [becauseYouWatchedMovies, setBecauseYouWatchedMovies] = useState([]);
  const [error, setError] = useState(null);

  const fetchMovieCategories = useCallback(async () => {
    try {
      setLoading(true);

      const cachedData = MoviesService.getMoviesCache("movieListsCache");
      let movieListsAccumulator;

      if (cachedData) {
        movieListsAccumulator = JSON.parse(cachedData);
      } else {
        movieListsAccumulator = await Promise.all(
          movieCategories.map(async (item) => {
            const categoryMovies = await getMovies(item.apiCall);
            return {
              title: item.title,
              tag: item.apiCall,
              movies: item.pagination ? categoryMovies.results : categoryMovies,
              pages: item.pagination ? categoryMovies.total_pages : 1,
            };
          })
        );
        MoviesService.setMoviesCache("movieListsCache", JSON.stringify(movieListsAccumulator));
      }

      setMovieLists(movieListsAccumulator);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [movieCategories]);

  useEffect(() => {
    fetchMovieCategories();
  }, [fetchMovieCategories]);

  useEffect(() => {
    const fetchWatchedAndListed = async () => {
      try {
        const updatedLists = await Promise.all(
          ["watched", "listed"].map(async (apiCall) => {
            const movies = await getMovies(apiCall);
            const originalTitle = movieCategories.find((item) => item.apiCall === apiCall)?.title || "";
            return {
              tag: apiCall,
              title: originalTitle,
              movies: movies,
              pages: 1,
            };
          })
        );
  
        setMovieLists((prevLists) =>
          prevLists.map((list) =>
            updatedLists.find((updated) => updated.tag === list.tag) || list
          )
        );
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchWatchedAndListed();
  }, [movieCategories]);

  const randomMovie = useMemo(() => {
    const watchedList = movieLists.find((list) => list.tag === "watched");
    return watchedList ? getRandomMovie(watchedList.movies) : null;
  }, [movieLists]);

  useEffect(() => {
    const fetchBecauseYouWatched = async () => {
      if (randomMovie) {
        try {
          const recommendations = await MoviesService.getRecommendedMovies(randomMovie.id);
          setBecauseYouWatchedMovies(recommendations.data.results);
        } catch (error) {
          setError(error.message);
        }
      }
    };
    fetchBecauseYouWatched();
  }, [randomMovie]);

  useEffect(() => {
    const fetchCarouselMovies = async () => {
      try {
        const trendingMovies = await MoviesService.getMoviesList("trending");
        setCarouselMovies(trendingMovies.results);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCarouselMovies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="bg-background flex flex-1 flex-grow flex-col pb-8">
      <section className="w-full z-0">
        <Carousel
          className=""
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 7000 })]}
        >
          <CarouselContent>
            {carouselMovies.map((movie) => (
              <CarouselItem key={movie.id}>
                <div
                  style={{
                    backgroundImage: `url(${
                      import.meta.env.VITE_API_IMAGE_URL
                    }original${movie?.backdrop_path})`,
                  }}
                  className="bg-cover bg-no-repeat"
                >
                  <div className="bg-gradient-to-t from-background flex items-start p-4 pb-16 lg:px-8 lg:pb-44 xl:pb-[50vh] flex-col justify-end w-full min-w-screen min-h-[calc(100vw*9/16)]">
                    <h2 className="text-text font-bold text-2xl lg:text-4xl">
                      {movie.title}
                    </h2>
                    <button className="bg-secondary hover:bg-primary text-text font-bold lg:text-2xl flex rounded-xl mt-2">
                      <Link
                        to={`/movie/${movie.id}`}
                        className="p-2 px-8 w-full"
                      >
                        Ver filme
                      </Link>
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      {error ? (
        <ErrorDialog
          title="Erro ao carregar filmes"
          error={{ message: error }}
        />
      ) : (
        randomMovie && (
          <MovieSection
            key="because-you-watched"
            title={`Porque você assistiu: ${randomMovie.title}`}
            movies={becauseYouWatchedMovies}
            first={true}
          />
        )
      )}
      {movieLists.map((item, index) => (
        <MovieSection
          key={index}
          title={item.title}
          movies={item.movies}
          pages={item.pages}
          tag={item.tag}
          first={index === 0 && !randomMovie}
        />
      ))}
      <button className="bg-secondary mt-6 mx-6 text-text rounded-xl text-2xl font-semibold hover:bg-primary">
        <Link to="search/all" className="flex p-4 items-center justify-center">
          Ver todos os filmes
        </Link>
      </button>
      <ScrollRestoration />
    </main>
  );
}

const getMovies = async (apiCall) => {
  if (!apiCall) {
    console.error("API call is undefined");
    return;
  }
  if (apiCall === "listed" || apiCall === "watched") {
    return await getSavedMoviesInfos(apiCall);
  }
  return await MoviesService.getMoviesList(apiCall);
};

const getSavedMoviesInfos = async (type) => {
  return await MoviesService.getSavedMoviesInfos(type);
};

const getRandomMovie = (moviesList) => {
  const randomIndex = Math.floor(Math.random() * moviesList.length);
  return moviesList[randomIndex];
};

export default Home;
