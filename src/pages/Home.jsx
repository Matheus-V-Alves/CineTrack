import { MovieSection } from "@/components/movieSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

function Home() {
  return (
    <main className="bg-background flex flex-1 flex-grow flex-col pb-8">
      <section className="w-full">
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
      <MovieSection title="Em Alta" first />
      <MovieSection title="Ação" />
    </main>
  );
}

export default Home;
