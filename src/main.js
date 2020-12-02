import {getRandomInteger} from "./utils.js";
import {createProfileTemplate} from "./view/profile.js";
import {createSiteMemuContainerTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createStatsTemplate} from "./view/stats.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createFilmsContainerTemplate} from "./view/films-container.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createPopupTemplate} from "./view/popup.js";
import {createCommentTemplate} from "./view/comment.js";
import {createNewCommentTemplate} from "./view/new-comment.js";
import {generateFilm} from "./mock/film-mock.js";
import {generateComment} from "./mock/comment-mock.js";
import {generateFilter} from "./mock/filter-mock.js";

const FILMS_COUNT = 19;
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const headerMainElement = document.querySelector(`.header`);
const footerMainElement = document.querySelector(`.footer`);

render(headerMainElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMemuContainerTemplate(), `beforeend`);

const menuContainer = siteMainElement.querySelector(`.main-navigation`);

render(menuContainer, createFilterTemplate(filters), `beforeend`);
render(menuContainer, createStatsTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createFilmsContainerTemplate(), `beforeend`);

const filmsMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
const filmsMainContainer = filmsMainList.querySelector(`.films-list__container`);
const filmsExtraLists = siteMainElement.querySelectorAll(`.films-list--extra`);

// фильмы
for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsMainContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsMainList, createShowMoreButtonTemplate(), `beforeend`);

  const showMoreButton = filmsMainList.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => render(filmsMainContainer, createFilmCardTemplate(film), `beforeend`));
    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

filmsExtraLists.forEach((list) => {
  const filmsExtraContainer = list.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(filmsExtraContainer, createFilmCardTemplate(films[i]), `beforeend`);
  }
});

render(footerMainElement, createPopupTemplate(films[0]), `afterend`);
// для примера отрисовала для 1 карточки. Или нужно сделать для всех?

// комментарии
const commentsList = document.querySelector(`.film-details__comments-list`);
const randomCommentsQauntity = getRandomInteger(0, 5);
const comments = new Array(randomCommentsQauntity).fill().map(generateComment);

for (let i = 0; i < randomCommentsQauntity; i++) {
  render(commentsList, createCommentTemplate(comments[i]), `beforeend`);
}

// форма комментария
const commentsContainer = document.querySelector(`.film-details__comments-wrap`);
render(commentsList, createNewCommentTemplate(), `beforeend`);
