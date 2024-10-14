import { ErrorDialog } from "@/components/error-dialog";
import { MovieSection } from "@/components/movieSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import moviesService from "@/services/moviesService";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

function Home() {
  const [movieCategories] = useState([
    {
      apiCall: "popular",
      title: "Em alta",
    },
    {
      apiCall: "listed",
      title: "Sua Lista",
    },
    {
      apiCall: "top_rated",
      title: "Melhor avaliados",
    },
    {
      apiCall: "upcoming",
      title: "Chegando em breve",
    },
    {
      apiCall: "now_playing",
      title: "Em cartaz",
    },

    {
      apiCall: "watched",
      title: "Assistidos",
    }
  ]);
  const [movieLists, setMovieLists] = useState([]);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
      const moviesData = await Promise.all(
        movieCategories.map((item) => getMovies(item.apiCall))
      );
      setMovieLists(moviesData);
      moviesData.map((item) => item.error && setError(item.error));
  };

  useEffect(() => {
    fetchMovies(); // Chama a função uma única vez quando o componente é montado
  }, []); // Array vazio como dependência para garantir execução única

  return (
    <main className="bg-background flex flex-1 flex-grow flex-col pb-8">
      {console.log("MovieLists", movieLists)}
      <section className="w-full z-0">
        <h1></h1>
        <Carousel
          className=""
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 7000,
            }),
          ]}
        >
          <CarouselContent>
            {Array.from({ length: 5 }, (_, index) => (
              <CarouselItem key={index}>
                <div className="bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-gritty-cinematic-backdrop-a-luxurious-and-elegant-3d-rendering-of-a-image_3805012.jpg')] bg-cover bg-no-repeat ">
                  <div className="bg-gradient-to-t from-background  flex items-start p-4 pb-16 lg:px-8 lg:pb-44 xl:pb-[50vh] flex-col justify-end w-full min-w-screen min-h-[calc(100vw*9/16)]">
                    <h2 className="text-text font-bold text-2xl lg:text-4xl">
                      Recomendado para você
                    </h2>
                    <button className="bg-secondary text-text font-bold lg:text-2xl p-2 px-8 rounded-xl mt-2">
                      Ver filme
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      {error ? (
        <ErrorDialog title={'Erro ao carregar filmes'} error={error} />
      ) : (
        movieLists.map((item, index) => (
          <MovieSection
            key={index}
            title={movieCategories[index].title}
            first={index === 0}
            movies={item}
          />
        ))
      )}

    </main>
  );
}

const getMovies = async (apiCall) => {
  if (!apiCall) {
    console.log("API call is undefined");
    return;
  }
  if (apiCall === 'listed' || apiCall === 'watched') {
    return await getSavedMoviesInfos(apiCall);
  }
  return await moviesService.getMoviesList(apiCall);
};

const getSavedMoviesInfos = async (type) => {
  return await moviesService.getSavedMoviesInfos(type);
}

export default Home;
