import {createProfileTemplate} from "./view/profile.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilmsContainerTemplate} from "./view/films-container.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createPopupTemplate} from "./view/popup.js";

function render(container, template, place) {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const headerMainElement = document.querySelector(`.header`);
const footerMainElement = document.querySelector(`.footer`);

render (headerMainElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilmsContainerTemplate(), `beforeend`);

const filmsMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
const filmsMainContainer = filmsMainList.querySelector(`.films-list__container`);
const filmsExtraLists = siteMainElement.querySelectorAll(`.films-list--extra`);

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsMainContainer, createFilmCardTemplate(), `beforeend`);
}
render(filmsMainList, createShowMoreButtonTemplate(), `beforeend`);

filmsExtraLists.forEach((list) => {
  const filmsExtraContainer = list.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(filmsExtraContainer, createFilmCardTemplate(), `beforeend`);
  }
});

render(footerMainElement, createPopupTemplate(), `afterend`);
