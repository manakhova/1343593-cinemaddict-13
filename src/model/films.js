import Observer from "../utils/observer";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        {
          id: film.id,
          title: film.film_info.title,
          originalTitle: film.film_info.alternative_title,
          poster: film.film_info.poster,
          director: film.film_info.director,
          description: film.film_info.description,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          genres: film.film_info.genre,
          year: new Date(film.film_info.release.date),
          country: film.film_info.release.release_country,
          duration: film.film_info.runtime,
          rating: film.film_info.total_rating,
          age: film.film_info.age_rating,
          isInWatchlist: film.user_details.watchlist,
          isInHistory: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          watchingDate: new Date(film.user_details.watching_date) !== null ? film.user_details.watching_date : film.user_details.watching_date,
          comments: film.comments
        }
    );
    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        {
          'id': film.id,
          'film_info': {
            'title': film.title,
            'alternative_title': film.originalTitle,
            'poster': film.poster,
            'director': film.director,
            'description': film.description,
            'writers': film.writers,
            'actors': film.actors,
            'genre': film.genres,
            'release': {
              'date': film.year.toISOString(),
              'release_country': film.country
            },
            'runtime': film.duration,
            'total_rating': film.rating,
            'age_rating': film.age,
          },
          'user_details': {
            'watchlist': film.isInWatchlist,
            'already_watched': film.isInHistory,
            'favorite': film.isFavorite,
            'watching_date': film.watchingDate instanceof Date ? film.watchingDate.toISOString() : null
          },
          'comments': film.comments
        }
    );
    return adaptedFilm;
  }
}
