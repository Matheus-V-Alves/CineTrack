import { MovieCard } from "./movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";

export const MovieSection = ({ title, first = false, movies, pages=1, tag='' }) => {

  const verMais = {
    id: 'verMais',
    title: 'Ver Mais',
    overview: 'Ver Mais',
    poster_path: '/vermais.jpg',
    backdrop_path: '/vermais.jpg',
    vote_average: 0,
  }
  
  return (
    <>
      {movies && movies.length > 0 ? (
        <section
          className={`z-20 flex flex-col px-4 gap-4 mt-8 lg:mt-16 xl:px-8 ${
            first ? "lg:-mt-44 xl:-mt-[40vh]" : ""
          }`}
        >
          <>
            <h1 className="text-text font-bold text-xl lg:text-2xl z-20">
              {title}
            </h1>
            <Carousel
              className="w-[90vw] md:w-[93vw] lg:w-[95vw]"
              opts={{
                align: "start",
              }}
            >
              <CarouselContent>
                {movies.map((movie) => (
                  <CarouselItem key={movie.id} className="basis-4/7">
                    <MovieCard movie={movie} id={movie.id} />
                  </CarouselItem>
                ))}

                {pages > 1 ? (
                  <CarouselItem className="basis-4/7">
                    <MovieCard movie={verMais} id={verMais.id} tag={tag} />
                  </CarouselItem>
                ) : null}
              </CarouselContent>
              <CarouselNext className="-right-4 bg-other text-text" />
            </Carousel>
          </>
        </section>
      ) : (
        ""
      )}
    </>
  );
};
