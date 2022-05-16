import axios from "axios";

const URL = "https://api.themoviedb.org/3/search/movie";
const KEY = "60778458bdbdfa7e14ca7e73fe4a1fef";

export default class FetchImages {
  constructor() {
    this.searchQuery = "";
    this.page = 1;
    this.per_page = 40;
    this.year = "";
  }

  fetchImages() {
    return axios
      .get(URL, {
        params: {
          api_key: KEY,
          language: en-US,
          query: this.searchQuery,
          page: this.page,
          include_adult: false,
          year: this.year,
          // per_page: this.per_page,
        },
      })
      .then((response) => {
        this.incrementPage();
        return response.data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
