import MoviesService from "@/services/MoviesService";

export const getRecommendedMovies = async () => {
  const userWatched = await MoviesService.getSavedMoviesInfos("watched");

  if (userWatched.length === 0) {
    return MoviesService.getMoviesList("top_rated");
  }

  const maxMovies = Math.min(userWatched.length, 5);
  const randomWatchedMovies = [];

  while (randomWatchedMovies.length < maxMovies) {
    const randomIndex = Math.floor(Math.random() * userWatched.length);
    const selectedMovie = userWatched[randomIndex];

    if (!randomWatchedMovies.some((movie) => movie.id === selectedMovie.id)) {
      randomWatchedMovies.push(selectedMovie);
    }
  }

  const recommendedMoviesMap = new Map();
  const addRecommendedMovies = async (moviesArray) => {
    const recommendationsPromises = moviesArray.map((movie) =>
      MoviesService.getRecommendedMovies(movie.id)
    );

    const recommendationsResponses = await Promise.all(recommendationsPromises);

    recommendationsResponses.forEach((response) => {
      response.data.results.forEach((recommendedMovie) => {
        recommendedMoviesMap.set(recommendedMovie.id, recommendedMovie);
      });
    });
  };

  await addRecommendedMovies(randomWatchedMovies);

  const watchedMovieIds = new Set(userWatched.map((movie) => movie.id));

  let recommendedMoviesArray = Array.from(recommendedMoviesMap.values());

  recommendedMoviesArray = recommendedMoviesArray
    .filter(
      (movie) =>
        !watchedMovieIds.has(movie.id) &&
        movie.vote_average >= 7 &&
        movie.popularity > 100
    )
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 20);

  for (let i = recommendedMoviesArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [recommendedMoviesArray[i], recommendedMoviesArray[j]] = [
      recommendedMoviesArray[j],
      recommendedMoviesArray[i],
    ];
  }

  return recommendedMoviesArray;
};
