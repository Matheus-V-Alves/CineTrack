import { ErrorDialog } from "@/components/error-dialog";
import { Loading } from "@/components/loading";
import { MovieSection } from "@/components/movie-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getRecommendedMovies } from "@/helpers/recommendationHelper";
import MoviesService from "@/services/MoviesService";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [movieCategories] = useState([
    { apiCall: "popular", title: "Em alta" },
    { apiCall: "listed", title: "Sua Lista" },
    { apiCall: "top_rated", title: "Melhor avaliados" },
    { apiCall: "upcoming", title: "Chegando em breve" },
    { apiCall: "now_playing", title: "Em cartaz" },
    { apiCall: "watched", title: "Assistidos" },
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
        // Busca todos os filmes das categorias
        const moviesData = await Promise.all(
          movieCategories.map((item) => getMovies(item.apiCall))
        );
        setMovieLists(moviesData);

        // Seleciona um filme aleatório da lista de assistidos (se disponível)
        const watchedMovies = moviesData.find(
          (category, index) => movieCategories[index].apiCall === "watched"
        );
        if (watchedMovies && watchedMovies.length > 0) {
          const selectedMovie = getRandomMovie(watchedMovies);
          setRandomMovie(selectedMovie);
        }

        // Busca as recomendações gerais
        const recommendedMovies = await getRecommendedMovies();
        setRecommendedMovies(recommendedMovies);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Executa uma vez na montagem do componente

  // Use um efeito separado para buscar as recomendações baseadas no filme aleatório
  useEffect(() => {
    const fetchItemRecommendation = async (movie) => {
      try {
        const response = await MoviesService.getRecommendedMovies(movie.id);
        setBecauseYouWatched(response.data.results);
      } catch (error) {
        setError(error.message);
      }
    };

    if (randomMovie) {
      fetchItemRecommendation(randomMovie);
    }
  }, [randomMovie]); // Executa sempre que randomMovie for atualizado

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
                    backgroundImage: `url(${import.meta.env.VITE_API_IMAGE_URL}original${movie?.backdrop_path})`,
                  }}
                  className="bg-cover bg-no-repeat"
                >
                  <div className="bg-gradient-to-t from-background flex items-start p-4 pb-16 lg:px-8 lg:pb-44 xl:pb-[50vh] flex-col justify-end w-full min-w-screen min-h-[calc(100vw*9/16)]">
                    <h2 className="text-text font-bold text-2xl lg:text-4xl">
                      {movie.title}
                    </h2>
                    <button className="bg-secondary hover:bg-primary text-text font-bold lg:text-2xl flex rounded-xl mt-2">
                      <Link to={`/movie/${movie.id}`} className="p-2 px-8 w-full">Ver filme</Link>
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      {error ? (
        <ErrorDialog title="Erro ao carregar filmes" error={error} />
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
          title={movieCategories[index].title}
          movies={item}
          first={index === 0 && !randomMovie} 
        />
      ))}
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

// Função que retorna um filme aleatório
const getRandomMovie = (moviesList) => {
  const randomIndex = Math.floor(Math.random() * moviesList.length);
  return moviesList[randomIndex];
};

export default Home;
