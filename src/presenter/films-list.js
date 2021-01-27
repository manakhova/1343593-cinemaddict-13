import {render, RenderPosition, remove} from "../utils/render";
import {sortFilmBy} from "../utils/common";
import {SortView} from "../view/sorting";
import FilmsContainerView from "../view/films-container";
import NoFilmView from "../view/no-film";
import ShowMoreButtonView from "../view/show-more-button";
import FilmPresenter from "./film";
import {SortType, UpdateType, UserAction} from "../const.js";
import {filter} from "../utils/filter.js";

const FILM_COUNT_PER_STEP = 5;

export default class FilmList {
  constructor(filmsContainer, filmsModel, commentsModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = {};

    this._filmListComponent = new FilmsContainerView();
    this._noFilmComponent = new NoFilmView();
    this._sortingListComponent = null;
    this._showMoreButtonComponent = null;

    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._filmsContainer, this._filmListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsContainer();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmBy(`year`));
      case SortType.RATING:
        return filteredFilms.sort(sortFilmBy(`rating`));
      default:
        return filteredFilms;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmsContainer();
        this._renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsContainer({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsContainer();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsContainer({resetRenderedFilmCount: true});
    this._renderFilmsContainer();
  }

  _renderSort() {
    if (this._sortingListComponent !== null) {
      this._sortingListComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmList, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsMainContainer, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._filmMainList, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmMainList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this._renderFilms(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _clearFilmsContainer({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);


    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }


    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsContainer() {
    const siteMainElement = document.querySelector(`.main`);
    const filmList = siteMainElement.querySelector(`.films`);
    const filmMainList = siteMainElement.querySelector(`.films-list:first-of-type`);
    const filmsMainContainer = filmMainList.querySelector(`.films-list__container`);
    this._filmList = filmList;
    this._filmMainList = filmMainList;
    this._filmsMainContainer = filmsMainContainer;

    const films = this._getFilms();
    const filmCount = films.length;

    this._renderSort();

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }
}
