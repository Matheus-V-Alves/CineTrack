import { resolve } from "@/api/resolve";
import api from "@/api/axios";

class MoviesService {
  constructor() {
    this.defaultLanguage = "language=pt-BR";
  }

  async getMoviesList(list, page=1) {
    const cacheKey = `${list}Cache`;
    const cachedData = this.getMoviesCache(cacheKey);

    if (cachedData && page === 1) {
      return cachedData.data;
    }

    const url = `/movie/${list}?${this.defaultLanguage}&page=${page}`;
    let response = await resolve(api.get(url));
    if (response.data && page === 1) {
      this.setMoviesCache(cacheKey, response.data);
    }
    return response.data;
  }

  getMoviesCache(cacheKey) {
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      const cacheData = JSON.parse(cache);
      if (new Date(cacheData.timestamp) > new Date()) {
        return cacheData;
      }
      return null;
    }
  }

  setMoviesCache(cacheKey, data) {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 12);
    const cacheData = {
      data,
      timestamp: futureDate.toISOString(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }

  async getAllMovies(page=1, filters) {
    let url = `/discover/movie?${this.defaultLanguage}&page=${page}&sort_by=popularity.desc`;
    if (filters.generos.length > 0) {
      url += `&with_genres=${filters.generos.join(",")}`;
    }
    if (filters.nota) {
      if(filters.nota === "<5") {
        url += `&vote_average.lte=5&vote_count.gte=1`;
      } else {
      url += `&vote_average.gte=${filters.nota}`;
      }
    }
    let response = await resolve(api.get(url));
    return response.data;
  }

  async getTrendingMovies(page=1) {
    const url = `/trending/movie/week?${this.defaultLanguage}&page=${page}`;
    let response = await resolve(api.get(url));
    return response.data;
  }

  async getMovieDetails(id) {
    const url = `/movie/${id}?${this.defaultLanguage}`;
    return await resolve(api.get(url));
  }

  async getMovieVideos(id) {
    const url = `/movie/${id}/videos?${this.defaultLanguage}`;
    return await resolve(api.get(url));
  }

  async getSavedMovies(type) {
    if (type !== "listed" && type !== "watched") {
      throw new Error("Invalid type");
    }
    if (!localStorage.getItem(type)) {
      localStorage.setItem(type, JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem(type));
  }

  async getSavedMoviesInfos(type) {
    let savedMovies = await this.getSavedMovies(type);
    let movies = [];
    for (let id of savedMovies) {
      let movie = await this.getMovieDetails(id);
      if (movie.data) {
        movies.push(movie.data);
      }
    }
    return movies;
  }

  async saveMovie(id, type) {
    let saved = await this.getSavedMovies(type);
    saved.push(id);
    localStorage.setItem(type, JSON.stringify(saved));
  }

  async removeSavedMovie(id, type) {
    let saved = await this.getSavedMovies(type);
    saved = saved.filter((movieId) => movieId !== id);
    localStorage.setItem(type, JSON.stringify(saved));
  }

  async isMovieSaved(id, type) {
    let savedMovies = await this.getSavedMovies(type);
    return savedMovies.some((movieId) => movieId === id);
  }

  async getWatchProviders(id) {
    const url = `/movie/${id}/watch/providers`;
    const result = await resolve(api.get(url));
    if (result.data.results["BR"]) {
      result.data = result.data.results["BR"];
    } else {
      result.data = {};
    }
    return result;
  }

  async searchMovies(query, page = 1) {
    const url = `/search/movie?${this.defaultLanguage}&query=${query}&page=${page}`;
    let response = await resolve(api.get(url));
    return response;
  }

  async getRecommendedMovies(id) {
    const url = `/movie/${id}/recommendations?${this.defaultLanguage}`;
    return await resolve(api.get(url));
  }

  getRecommendedMoviesCache() {
    const cache = localStorage.getItem("recommendedMoviesCache");
    return cache ? JSON.parse(cache) : {};
  }

  setRecommendedMovieCache(movieId, recommendations) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const cacheData = {
      movieId,
      recommendations,
      timestamp: futureDate.toISOString(),
    };
    localStorage.setItem("recommendedMoviesCache", JSON.stringify(cacheData));
  }

  async getCachedRecommendedMovies() {
    const cacheData = this.getRecommendedMoviesCache();
    if (new Date(cacheData.timestamp) > new Date()) {
      return cacheData.recommendations;
    }
    return null;
  }

  async fetchRecommendedMovies(movieId) {
    let cachedRecommendations = await this.getCachedRecommendedMovies();
    if (cachedRecommendations) {
      return cachedRecommendations;
    } else {
      const recommendations = await this.getRecommendedMovies(movieId);
      this.setRecommendedMovieCache(movieId, recommendations.data.results);
      return recommendations.data.results;
    }
  }

  async getGenres() {
    const url = `/genre/movie/list?${this.defaultLanguage}`;
    return await resolve(api.get(url));
  }
}
export default new MoviesService();
