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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [randomMovie, setRandomMovie] = useState(null);
  const [becauseYouWatched, setBecauseYouWatched] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieListsAccumulator = [];
  
        for (let i = 0; i < movieCategories.length; i++) {
          const item = movieCategories[i];
          const categoryMovies = await getMovies(item.apiCall);
  
          movieListsAccumulator.push({
            title: item.title,
            tag: item.apiCall,
            movies: item.pagination ? categoryMovies.results : categoryMovies,
            pages: item.pagination ? categoryMovies.total_pages : 1,
          });

          if (item.apiCall === "watched") {
            if (categoryMovies.length > 0) {
              const watchedRecommendation = getRandomMovie(categoryMovies);
              setRandomMovie(watchedRecommendation);
  
              const becauseYouWatched = await MoviesService.getRecommendedMovies(
                watchedRecommendation.id
              );
              setBecauseYouWatched(becauseYouWatched.data.results);
  
              const recommendations =
                await MoviesService.fetchRecommendedMovies(
                  getRandomMovie(categoryMovies).id
                );
              setRecommendedMovies(recommendations);
            } else {
              const listRecommendation = await MoviesService.getMoviesList("popular");
              setRecommendedMovies(
                Array.isArray(listRecommendation.results) ? listRecommendation.results : []
              );
            }
          }
        }
        setMovieLists(movieListsAccumulator);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchData();
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
            {recommendedMovies.map((movie) => (
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
            movies={becauseYouWatched}
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
      <button className="bg-secondary p-4 mt-6 mx-6 text-text rounded-xl text-2xl font-semibold hover:bg-primary"><Link to="search/all">Ver todos os filmes</Link></button>
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
  if (apiCall === "trending") {
    return await MoviesService.getTrendingMovies();
  }
  return await MoviesService.getMoviesList(apiCall);
};

const getSavedMoviesInfos = async (type) => {
  return await MoviesService.getSavedMoviesInfos(type);
};

// Função que retorna um filme aleatório
const getRandomMovie = (moviesList) => {
  const randomIndex = Math.floor(Math.random() * moviesList.length);
  return moviesList[randomIndex];
};

export default Home;
