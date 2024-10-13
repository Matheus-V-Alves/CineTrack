import { MovieCard } from "./movieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "./ui/carousel";

export const MovieSection = ({ title, first=false }) => {
    return (
        <section className={`flex flex-col px-4 gap-4 mt-8 lg:mt-16 xl:px-8 ${first ? 'lg:-mt-44 xl:-mt-[40vh]': ''}`}>
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
            {Array.from({ length: 12 }, (_, index) => (
              <CarouselItem key={index} className="basis-4/7">
                <MovieCard
                  movie={{
                    title: "Filme",
                    image:
                      "https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-gritty-cinematic-backdrop-a-luxurious-and-elegant-3d-rendering-of-a-image_3805012.jpg",
                  }}
                  id={index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="-right-4 bg-other text-text" />
        </Carousel>
      </section>
    );
}