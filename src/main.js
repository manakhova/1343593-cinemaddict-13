import {getRandomInteger, render, RenderPosition} from "./utils";
import ProfileView from "./view/profile";
import SiteMenuView from "./view/site-menu";
import FilterView from "./view/filter";
import StatsView from "./view/stats";
import SortView from "./view/sorting";
import FilmsContainerView from "./view/films-container";
import NoFilmView from "./view/no-film";
import FilmCardView from "./view/film-card";
import ShowMoreButtonView from "./view/show-more-button";
import FilmPopupView from "./view/popup";
import CommentView from "./view/comment";
import NewCommentView from "./view/new-comment";
import {generateFilm} from "./mock/film-mock";
import {generateComment} from "./mock/comment-mock";
import {generateFilter} from "./mock/filter-mock";

const FILMS_COUNT = 22;
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

// ф-я для отрисоки карточек + всякие обработчики
const renderFilm = (container, film) => {
  const filmCard = new FilmCardView(film);
  const filmPopup = new FilmPopupView(film);

  // комментарии. Поскольку я вынесла их отдельно от попапа, приходится отрисовывать прямо тут.
  // Можно сделать как-то красивее? Может, вернуть их разметку в попап?
  const commentsList = filmPopup.getElement().querySelector(`.film-details__comments-list`);
  const comments = new Array(film.commentsCount).fill().map(generateComment);// вот так получилось синхронизировать

  for (let i = 0; i < film.commentsCount; i++) {
    render(commentsList, new CommentView(comments[i]).getElement(), RenderPosition.BEFOREEND);
  }

  // форма комментария
  const commentsContainer = filmPopup.getElement().querySelector(`.film-details__comments-wrap`);
  render(commentsContainer, new NewCommentView().getElement(), RenderPosition.BEFOREEND);

  // обработчики на элементы карточки и попапа
  const filmPoster = filmCard.getElement().querySelector(`.film-card__poster`);
  const filmTitle = filmCard.getElement().querySelector(`.film-card__title`);
  const filmComments = filmCard.getElement().querySelector(`.film-card__comments`);

  const popupCloseButton = filmPopup.getElement().querySelector(`.film-details__close-btn`);

  const filmElements = [filmPoster, filmTitle, filmComments];

  const filmCardClickHandler = () => {
    render(footerMainElement, filmPopup.getElement(), RenderPosition.AFTEREND);

    popupCloseButton.addEventListener(`click`, popupCloseButtonClickHandler);
    document.addEventListener(`keydown`, popupEscKeyDownHandler);
  };

  const popupCloseButtonClickHandler = () => {
    filmPopup.getElement().remove();

    popupCloseButton.removeEventListener(`click`, popupCloseButtonClickHandler);
    document.removeEventListener(`keydown`, popupEscKeyDownHandler);
  };

  const popupEscKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      filmPopup.getElement().remove();

      popupCloseButton.removeEventListener(`click`, popupCloseButtonClickHandler);
      document.removeEventListener(`keydown`, popupEscKeyDownHandler);
    }
  };

  filmElements.forEach((element) => {
    element.addEventListener(`click`, filmCardClickHandler);
  });

  render(container, filmCard.getElement(), RenderPosition.BEFOREEND);
};

// фильмы
if (films.length === 0) {
  render(filmsMainList, new NoFilmView().getElement(), RenderPosition.AFTERBEGIN)
} else {
  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(filmsMainContainer, films[i]);
  }
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsMainList, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsMainList.querySelector(`.films-list__show-more`);

  const showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => renderFilm(filmsMainContainer,film));
    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener(`click`, showMoreButtonClickHandler);
}


filmsExtraLists.forEach((list) => {
  const filmsExtraContainer = list.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(filmsExtraContainer, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
  }
});
