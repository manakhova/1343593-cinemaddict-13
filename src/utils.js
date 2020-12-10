import dayjs from "dayjs";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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

export const generateDate = () => {
  return dayjs(`${getRandomInteger(1910, 2020)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)} ${getRandomInteger(0, 23)}:${getRandomInteger(0, 60)}`);
};
