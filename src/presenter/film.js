import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/popup";
import {render, RenderPosition, remove, replace} from "../utils/render";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handlePopupEscKeyDown = this._handlePopupEscKeyDown.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    // this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setOpenPopupHandler(this._handleFilmCardClick);

    this._filmPopupComponent.setClosePopupHandler(this._handlePopupCloseButtonClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    // this._filmPopupComponent.setNewCommentSubmitHandler(this._handleAddCommentClick);

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

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _handleWatchlistClick() {
    // не понятно, какой тип обновления тут выбрать: PATCH или MINOR. Если MINOR, то карточки, как и нужно
    // будут удаляться из списка Watchlist, например, если данный фильм теперь не отмечен в этом списке.
    // С другой стороны, если эти отметки производить в попапе, то он удаляется вместе с карточкой, чего не
    // должно быть по тз. PATCH же не закрывает попап, но и не удаляет карточку из списка, когда это нужно
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

  _handleHistoryClick() {
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

  _handleFavoriteClick() {
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
    const footerMainElement = document.querySelector(`.footer`);

    this._changeMode();
    this._mode = Mode.POPUP;
    document.addEventListener(`keydown`, this._handlePopupEscKeyDown);

    render(footerMainElement, this._filmPopupComponent, RenderPosition.AFTEREND);
  }

  _handleDeleteCommentClick(comment) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        comment // ???
    );
  }

  // _handleAddCommentClick(comment) {
  //   this._changeData(
  //       UserAction.ADD_COMMENT,
  //       UpdateType.PATCH,
  //       comment // ???
  //   );
  // }

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
