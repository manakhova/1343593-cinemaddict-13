import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {RankScore, RankTitle, DESCRIPTION_LENGTH} from '../const';

dayjs.extend(duration);

export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const shuffleArray = (array) => {
  const items = array.slice();
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

export const generateDate = (date) => {
  return dayjs(date);
};

export const generateRuntime = (runtime) => {
  const hours = Math.floor(dayjs.duration(runtime, `m`).asHours());
  const minutes = dayjs.duration((runtime - hours * 60), `m`).asMinutes();

  return `${hours}h ${minutes}m`;
};

export const sortFilmBy = (property) => (filmA, filmB) => {
  return filmB[property] - filmA[property];
};

export const getUserRank = (films) => {
  const watchedFilmsCount = films.reduce((count, film) => count + Number(film.isInHistory), 0);

  if (watchedFilmsCount >= RankScore.NOVICE.MIN && watchedFilmsCount <= RankScore.NOVICE.MAX) {
    return RankTitle.NOVICE;
  } else if (watchedFilmsCount >= RankScore.FAN.MIN && watchedFilmsCount <= RankScore.FAN.MAX) {
    return RankTitle.FAN;
  } else if (watchedFilmsCount > RankScore.FAN.MAX) {
    return RankTitle.MOVIE_BUFF;
  } else {
    return RankTitle.NONE;
  }
};

export const getShortDescription = (description) => {
  return description.length >= DESCRIPTION_LENGTH ? `${description.slice(0, DESCRIPTION_LENGTH - 1)}...` : description;
};


