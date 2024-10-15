/* eslint-disable react/prop-types */
import { MovieCard } from "./movieCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";

export const MovieSection = ({ title, first = false, movies }) => {
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
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent>
                {movies.map((movie) => (
                  <CarouselItem key={movie.id} className="basis-4/7">
                    <MovieCard movie={movie} id={movie.id} />
                  </CarouselItem>
                ))}
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
