import {getRandomInteger, render, RenderPosition} from "./utils.js";
import ProfileView from "./view/profile.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import StatsView from "./view/stats.js";
import SortView from "./view/sorting.js";
import FilmsContainerView from "./view/films-container.js";
import FilmCardView from "./view/film-card.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmPopupView from "./view/popup.js";
import CommentView from "./view/comment.js";
import NewCommentView from "./view/new-comment.js";
import {generateFilm} from "./mock/film-mock.js";
import {generateComment} from "./mock/comment-mock.js";
import {generateFilter} from "./mock/filter-mock.js";

const FILMS_COUNT = 19;
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);


const siteMainElement = document.querySelector(`.main`);
const headerMainElement = document.querySelector(`.header`);
const footerMainElement = document.querySelector(`.footer`);

render(headerMainElement, new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

const menuContainer = siteMainElement.querySelector(`.main-navigation`);

render(menuContainer, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(menuContainer, new StatsView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsContainerView().getElement(), RenderPosition.BEFOREEND);

const filmsMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
const filmsMainContainer = filmsMainList.querySelector(`.films-list__container`);
const filmsExtraLists = siteMainElement.querySelectorAll(`.films-list--extra`);

//ф-я для отрисоки карточек + всякие обработчики
const renderFilm = (container, film) => {
  const filmCard = new FilmCardView(film);
  const filmPopup = new FilmPopupView(film);

  // комментарии. Поскольку я вынесла их отдельно от попапа, приходится отрисовывать прямо тут.
  // Можно сделать как-то красивее? Может, вернуть их разметку в попап?
  const commentsList = filmPopup.getElement().querySelector(`.film-details__comments-list`);
  const randomCommentsCount = getRandomInteger(0, 5);
  const comments = new Array(randomCommentsCount).fill().map(generateComment);

  for (let i = 0; i < randomCommentsCount; i++) {
    render(commentsList, new CommentView(comments[i]).getElement(), RenderPosition.BEFOREEND);
    // комментарии, почему-то не отрисовываются. Не вижу, где проблема.
  }

  // форма комментария
  const commentsContainer = document.querySelector(`.film-details__comments-wrap`);
  render(commentsList, new NewCommentView().getElement(), `beforeend`);

  // обработчики на элементы карточки и попапа
  const filmPoster = filmCard.getElement().querySelector(`.film-card__poster`);
  const filmTitle = filmCard.getElement().querySelector(`.film-card__title`);
  const filmComments = filmCard.getElement().querySelector(`.film-card__comments`);

  const popupCloseButton = filmPopup.getElement().querySelector(`.film-details__close-btn`);

  const filmElements = [filmPoster, filmTitle, filmComments];

  filmElements.forEach((element) => {
    element.addEventListener(`click`, () => {
      render(footerMainElement, filmPopup.getElement(), RenderPosition.AFTEREND);
    });
  });

  popupCloseButton.addEventListener(`click`, () => {
    filmPopup.getElement().remove();
  });

  render(container, filmCard.getElement(), RenderPosition.BEFOREEND);
};

// фильмы
for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderFilm(filmsMainContainer, films[i]);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsMainList, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsMainList.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => renderFilm(filmsMainContainer,film));
    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}


filmsExtraLists.forEach((list) => {
  const filmsExtraContainer = list.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(filmsExtraContainer, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
  }
});
