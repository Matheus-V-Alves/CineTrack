import { useToast } from "@/hooks/use-toast";
import moviesService from "@/services/moviesService";
import { Bookmark, BookmarkCheck, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
export const MovieActions = ({ movieId }) => {
  const { toast } = useToast();
  const [listed, setListed] = useState(false);
  const [watched, setWatched] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (type) => {
    try {
      const isSaved = await moviesService.isMovieSaved(movieId, type);
      if (isSaved) {
        await moviesService.removeSavedMovie(movieId, type);
        type === "listed" ? setListed(false) : setWatched(false);
        toast({
            title: `Filme removido da lista de ${type === "listed" ? "favoritos" : "assistidos"}`,
            type: "success",
            });
      } else {
        await moviesService.saveMovie(movieId, type);
        type === "listed" ? setListed(true) : setWatched(true);
        console.log("Movie saved to", type);
        toast({
            title: `Filme salvo na lista de ${type === "listed" ? "favoritos" : "assistidos"}`,
            type: "success",
          });
      }
    } catch (error) {
      console.error("Error handling movie save:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const fetchMovieStatus = async () => {
      try {
        const isListed = await moviesService.isMovieSaved(movieId, "listed");
        const isWatched = await moviesService.isMovieSaved(movieId, "watched");
        setListed(isListed);
        setWatched(isWatched);
      } catch (error) {
        console.error("Error fetching movie status:", error);
      }
    };
    fetchMovieStatus();
  }, [movieId]);

  return (
    <>
      {error && <p className="text-red-500">Erro ao salvar filme</p>}
      {listed ? (
        <BookmarkCheck
          className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
          onClick={() => handleSave("listed")}
        />
      ) : (
        <Bookmark
          className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
          onClick={() => handleSave("listed")}
        />
      )}
      {watched ? (
        <Eye
          className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
          onClick={() => handleSave("watched")}
        />
      ) : (
        <EyeOff
          className="size-8 hover:scale-110 transition-transform select-none cursor-pointer"
          onClick={() => handleSave("watched")}
        />
      )}
    </>
  );
};
