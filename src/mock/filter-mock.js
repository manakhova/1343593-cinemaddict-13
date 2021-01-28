import {FilterType} from "../const";

const filmToFilterMap = {
  [FilterType.ALL]: (films) => films.length,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist).length,
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isInHistory).length,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite).length
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films)
    };
  });
};
