import { CirclePlay } from "lucide-react";

function DetailsMovie() {
  return (
    <main>
      <section>
        <div className="bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-gritty-cinematic-backdrop-a-luxurious-and-elegant-3d-rendering-of-a-image_3805012.jpg')] bg-cover bg-no-repeat">
          <div className="bg-gradient-to-t from-background  flex items-center p-4 pb-16 lg:px-8 lg:pb-44 xl:pb-[50vh] flex-col justify-center">
            <div className="relative flex items-center justify-center" >
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/JfVOs4VSpmA"
              title="SPIDER-MAN: NO WAY HOME - Official Trailer (HD)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <div className="absolute top-[45%] flex items-center flex-col justify-center">
              <button className="bg-details text-text font-bold lg:text-2xl p-4 px-8 rounded-xl mt-2"><CirclePlay /></button>
              <h2 className="text-text font-bold text-2xl lg:text-4xl">
                Ver Trailer
              </h2>
            </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DetailsMovie;
