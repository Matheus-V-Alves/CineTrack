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
}
export default new MoviesService();
