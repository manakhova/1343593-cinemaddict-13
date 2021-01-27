import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

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

