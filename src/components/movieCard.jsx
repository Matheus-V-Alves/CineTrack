import { Link } from "react-router-dom";

export const MovieCard = ({ movie, id }) => {
  return (
    <Link to={`/movie/${id}`}>
      <div
        style={{
          backgroundImage: `url(${import.meta.env.VITE_API_IMAGE_URL}w600_and_h900_bestv2/${movie.poster_path})`,
        }}
        className={`bg-cover bg-no-repeat rounded-md w-48 h-72 cursor-pointer`}
      >
        <div className="hover:bg-gradient-to-t from-background flex items-start p-4 flex-col justify-end w-full h-full group transition-all duration-700 animate-in fade-in">
          <h2 className="text-text font-medium text-md hidden group-hover:flex transition-all duration-500 animate-in slide-in-from-bottom-10">
            {movie.title}
          </h2>
        </div>
      </div>
    </Link>
  );
};
