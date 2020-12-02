import {getRandomInteger, shuffleArray, generateDate} from "../utils.js";

const generateText = () => {
  const textItems = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  const randomText = shuffleArray(textItems);
  const randomQuantity = getRandomInteger(1, 5);

  return randomText.slice(randomQuantity);
};

const generateEmotion = () => {
  const emotions = [
    `smile`,
    `sleeping`,
    `puke`,
    `angry`
  ];
  const randomIndex = getRandomInteger(0, emotions.length - 1);

  return emotions[randomIndex];
};

const generateAuthor = () => {
  const authors = [
    `Lars von Trier`,
    `Christopher Nolan`,
    `Andrei Tarkovsky`,
    `Quentin Tarantino`,
    `Sergei Eisenstein`
  ];
  const randomIndex = getRandomInteger(0, authors.length - 1);

  return authors[randomIndex];
};


export const generateComment = () => {
  return {
    text: generateText(),
    emotion: generateEmotion(),
    author: generateAuthor(),
    day: generateDate().format(`DD/MM/YYYY HH:mm`)
  };
};
