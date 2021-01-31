import {getRandomInteger, shuffleArray, generateDate} from "../utils/common";
import {nanoid} from 'nanoid';

const generateTitle = () => {
  const titles = [
    `The Dance of Life`,
    `Made for Each Other`,
    `The Great Flamarion`,
    `Sagebrush Trail`,
    `Borat`
  ];
  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [
    `Sci-Fi`,
    `Animation`,
    `Fantasy`,
    `Comedy`,
    `TV Series`
  ];

  const randomGenres = shuffleArray(genres);
  const randomQuantity = getRandomInteger(1, genres.length - 1);

  return randomGenres.slice(randomQuantity);
};

const generatePoster = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`
  ];
  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateDirector = () => {
  const directors = [
    `Lars von Trier`,
    `Christopher Nolan`,
    `Andrei Tarkovsky`,
    `Quentin Tarantino`,
    `Sergei Eisenstein`
  ];
  const randomIndex = getRandomInteger(0, directors.length - 1);

  return directors[randomIndex];
};

const generateWriters = () => {
  const writers = [
    `Billy Wilder`,
    `Joel Coen`,
    `Ethan Coen`,
    `Quentin Tarantino`,
    `Woody Allen`
  ];
  const randomWriters = shuffleArray(writers);
  const randomQuantity = getRandomInteger(1, writers.length - 1);

  return randomWriters.slice(randomQuantity);
};

const generateActors = () => {
  const actors = [
    `Joaquin Phoenix`,
    `Eva Green`,
    `Sacha Baron Cohen`,
    `Margot Robbie`,
    `Charlotte Gainsbourg`
  ];
  const randomActors = shuffleArray(actors);
  const randomQuantity = getRandomInteger(1, actors.length - 1);

  return randomActors.slice(randomQuantity);
};

const generateCountry = () => {
  const countries = [
    `USA`,
    `Russia`,
    `France`
  ];
  const randomIndex = getRandomInteger(0, countries.length - 1);

  return countries[randomIndex];
};

const generateAge = () => {
  const ageLimits = [
    `0+`,
    `6+`,
    `12+`,
    `18+`
  ];
  const randomIndex = getRandomInteger(0, ageLimits.length - 1);

  return ageLimits[randomIndex];
};


export const generateFilm = () => {
  const isInHistory = Boolean(getRandomInteger(0, 1));
  return {
    id: nanoid(),
    title: generateTitle(),
    originalTitle: generateTitle(),
    poster: generatePoster(),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.
    Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
    rating: getRandomInteger(0, 10),
    year: `${getRandomInteger(1900, 2021)}-05-11T00:00:00.000Z`,
    duration: getRandomInteger(1, 200),
    country: generateCountry(),
    genres: generateGenre(),
    age: generateAge(),
    comments: [`1`, `2`, `3`, `4`, `5`],
    isInWatchlist: Boolean(getRandomInteger(0, 1)),
    isInHistory,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    watchingDate: isInHistory ? generateDate(`${getRandomInteger(2020, 2021)}-01-29T00:00:00.000Z`) : null,
  };
};
