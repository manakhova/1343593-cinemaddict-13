import {render, RenderPosition, remove} from "../utils/render";
import {updateItem} from "../utils/common.js";
import FilmsContainerView from "../view/films-container";
import NoFilmView from "../view/no-film";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";

const FILMS_COUNT_PER_STEP = 5;
// const EXTRA_FILMS_COUNT = 2;


export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = {};

    this._filmsListComponent = new FilmsContainerView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._filmsContainer, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilmsContainer();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsMainContainer, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((films) => this._renderFilm(films));
  }

  _renderNoFilms() {
    render(this._filmsMainList, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._films.slice(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => this._renderFilm(film));
    this._renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsMainList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmList() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_COUNT_PER_STEP));

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  // _renderExtraFilms(film) {
  //   const siteMainElement = document.querySelector(`.main`);
  //   const filmsExtraLists = siteMainElement.querySelectorAll(`.films-list--extra`);

  //   filmsExtraLists.forEach((list) => {
  //     const filmsExtraContainer = list.querySelector(`.films-list__container`);
  //     const filmComponent = new FilmCardView(film);

  //     this._renderFilms(0, EXTRA_FILMS_COUNT);
  //   });
  // пока не знаю, как сделать, тк тут отрисовка идет в тот же контейтер, что и основные фильмы
  // }

  _clearFilmsContainer() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmsContainer() {
    const siteMainElement = document.querySelector(`.main`);
    const filmsMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
    const filmsMainContainer = filmsMainList.querySelector(`.films-list__container`);
    // я правильно понимаю, что this._что-то-там - будет видно везде в классе?
    this._filmsMainList = filmsMainList;
    this._filmsMainContainer = filmsMainContainer;

    if (this._films.length === 0) {
      this._renderNoFilms();
    }

    this._renderFilmList();
    // this._renderExtraFilms();
  }
}
