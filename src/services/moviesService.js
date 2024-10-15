import { resolve } from "@/api/resolve";
import api from "@/api/axios";

class MoviesService {
  constructor() {
    this.defaultLanguage = "language=pt-BR";
  }

  async getMoviesList(list) {
    const url = `/movie/${list}?${this.defaultLanguage}&page=1`;
    let response = await resolve(api.get(url));
    if (response.data) {
      response = response.data.results;
    }
    return response;
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
    if(result.data.results["BR"]) {
      result.data = result.data.results["BR"];
    }else{
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
}
export default new MoviesService();
