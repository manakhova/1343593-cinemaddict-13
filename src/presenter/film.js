import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/popup";
import {render, RenderPosition, remove, replace} from "../utils/render";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export const State = {
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode, commentsModel, api) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._commentsModel = commentsModel;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._api = api;

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handlePopupEscKeyDown = this._handlePopupEscKeyDown.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupHistoryClick = this._handlePopupHistoryClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film, this._commentsModel);

    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setOpenPopupHandler(this._handleFilmCardClick);

    this._filmPopupComponent.setClosePopupHandler(this._handlePopupCloseButtonClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handlePopupWatchlistClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handlePopupHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handlePopupFavoriteClick);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    this._filmPopupComponent.setNewCommentSubmitHandler(this._handleAddCommentClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._filmPopupComponent.updateData({
        isDisabled: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.ADDING:
      case State.DELETING:
        this._filmPopupComponent.updateData({
          isDisabled: true
        });
        break;
      case State.ABORTING:
        this._filmPopupComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        )
    );
  }

  _handleHistoryClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isInHistory: !this._film.isInHistory
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handlePopupWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isInWatchlist: !this._film.isInWatchlist
            }
        )
    );
  }

  _handlePopupHistoryClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isInHistory: !this._film.isInHistory
            }
        )
    );
  }

  _handlePopupFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderPopup();
      })
      .catch(() => {
        this._commentsModel.setComments([]);
      });

    document.addEventListener(`keydown`, this._handlePopupEscKeyDown);
  }

  _renderPopup() {
    const footerMainElement = document.querySelector(`.footer`);
    render(footerMainElement, this._filmPopupComponent, RenderPosition.AFTEREND);
  }

  _handleDeleteCommentClick(comment) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {comment, film: this._film}
    );
  }

  _handleAddCommentClick(comment) {
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {comment, film: this._film}
    );
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _closePopup() {
    this._filmPopupComponent.reset(this._film);
    this._filmPopupComponent.getElement().remove();

    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._handlePopupEscKeyDown);
  }

  _handlePopupCloseButtonClick() {
    this._closePopup();
  }

  _handlePopupEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
    }
  }
}
