import FilmCardView from "../view/film-card";
import FilmPopupView from "../view/popup";
import CommentView from "../view/comment";
import NewCommentView from "../view/new-comment";
import {generateComment} from "../mock/comment-mock";
import {render, RenderPosition, remove, replace} from "../utils/render";

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
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);
    this._newCommentComponent = new NewCommentView();

    const commentsList = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    const comments = new Array(this._film.commentsCount).fill().map(generateComment);

    for (let i = 0; i < this._film.commentsCount; i++) {
      render(commentsList, new CommentView(comments[i]), RenderPosition.BEFOREEND);
    }

    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-wrap`);
    render(commentsContainer, this._newCommentComponent, RenderPosition.BEFOREEND);

    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setOpenPopupHandler(this._handleFilmCardClick);
    // перенесла все обработчики попапа сюда из _handleFilmCardClick, потому что
    // при клике в попапе на кнопки, карточки и попапы пересоздаются (из-за this._changeData),
    // а поскольку раньше эти обработчики навешивались только при рендере попапа, с текущего, который уже
    // отрендерен на пред. шаге, они просто слетали
    this._filmPopupComponent.setClosePopupHandler(this._handlePopupCloseButtonClick);
    document.addEventListener(`keydown`, this._handlePopupEscKeyDown);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

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

    // remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
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
        Object.assign(
            {},
            this._film,
            {
              isFavotite: !this._film.isFavotite
            }
        )
    );
  }

  _handleFilmCardClick() {
    const footerMainElement = document.querySelector(`.footer`);
    render(footerMainElement, this._filmPopupComponent, RenderPosition.AFTEREND);

    this._changeMode();
    this._mode = Mode.POPUP;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _closePopup() {
    this._filmPopupComponent.getElement().remove();

    this._mode = Mode.DEFAULT;

    this._filmPopupComponent.removeClosePopupHandler(this._handlePopupCloseButtonClick);
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
