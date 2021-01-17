import {render, RenderPosition, remove} from "../utils/render";
import {updateItem, sortFilmBy} from "../utils/common";
import {SortView, SortType} from "../view/sorting";
import FilmsContainerView from "../view/films-container";
import NoFilmView from "../view/no-film";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";

const FILMS_COUNT_PER_STEP = 5;
// const EXTRA_FILMS_COUNT = 2;


export default class FilmList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = {};

    this._filmListComponent = new FilmsContainerView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    render(this._filmsContainer, this._filmListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsContainer();
    this._renderSort();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmBy(`year`));
        break;
      case SortType.RATING:
        this._films.sort(sortFilmBy(`rating`));
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsContainer();
    this._renderFilmList();
  }

  _renderSort() {
    this._sortComponent = new SortView();
    this._currentSortType = SortType.DEFAULT;

    render(this._filmList, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    render(this._filmMainList, this._noFilmComponent, RenderPosition.AFTERBEGIN);
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
    render(this._filmMainList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

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

  //   filmExtraLists.forEach((list) => {
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
    const filmList = siteMainElement.querySelector(`.films`);
    const filmMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
    const filmsMainContainer = filmMainList.querySelector(`.films-list__container`);
    this._filmList = filmList;
    this._filmMainList = filmMainList;
    this._filmsMainContainer = filmsMainContainer;

    if (this._films.length === 0) {
      this._renderNoFilms();
    }

    this._renderFilmList();
    // this._renderExtraFilms();
  }
}
