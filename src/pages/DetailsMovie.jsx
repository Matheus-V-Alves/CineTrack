import moviesService from "@/services/moviesService";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

function useWindowSize() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return width;
}

function DetailsMovie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const width = useWindowSize();

  useEffect(() => {
    const fetchMovie = async () => {
      console.log("Fetching movie...");
      const movieData = await getMovie(movieId);
      console.log("Movie fetched:", movieData);
      if (movieData.error) {
        console.error("Error fetching movie:", movieData.error);
        setError(movieData.error);
      } else {
        setMovie(movieData.data || []);
      }
    };

    fetchMovie();
  }, [movieId]);
  return (
    <main>
      <section>
        <div className="bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20230706/pngtree-gritty-cinematic-backdrop-a-luxurious-and-elegant-3d-rendering-of-a-image_3805012.jpg')] bg-cover bg-no-repeat">
          <div className="bg-gradient-to-t from-background  flex items-center flex-col justify-center">
            <div className="relative flex items-center justify-center">
              <iframe
                width={width < 768 ? width : (width / 4) * 3}
                height={
                  width < 768 ? (width / 16) * 9 : (((width / 4) * 3) / 16) * 9
                }
                src="https://www.youtube.com/embed/JfVOs4VSpmA"
                title="SPIDER-MAN: NO WAY HOME - Official Trailer (HD)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col items-center">
          <h1 className="text-text font-bold text-2xl lg:text-4xl">
            {movie?.title}
          </h1>
          <p className="text-text font-medium text-md lg:text-lg">
            {movie?.overview}
          </p>
        </div>
      </section>
    </main>
  );
}

const getMovie = async (id) => {
  return await moviesService.getMovieDetails(id);
};

export default DetailsMovie;
