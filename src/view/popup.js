import SmartView from "./smart";

const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const createCommentsTemplate = (comments) => {
  return comments.map((comment) =>
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${comment.day}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`).join(`\n`);
};

const createEmojiList = (emojiItems, emojiSelected) => {
  return emojiItems.map((emotion) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" 
    id="emoji-${emotion}" value="${emotion}" ${emojiSelected === emotion ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji" data-id="${emotion}">
    </label>`).join(`\n`);
};

const createNewCommentTemplate = (emojiSelected, emojiList) => {
  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${emojiSelected !== `` ? `<img src="./images/emoji/${emojiSelected}.png" width="55" height="55" alt="emoji">` : ``}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      ${emojiList}
    </div>
  </div>`;
};

const createButtonTemplate = (buttonIdName, isActive, buttonName) => {
  return `<input type="checkbox" ${isActive ? `checked` : ``} class="film-details__control-input visually-hidden" id="${buttonIdName}" name="${buttonIdName}">
  <label for="${buttonIdName}" class="film-details__control-label film-details__control-label--${buttonIdName}">${buttonName}</label>`;
};

const createPopupTemplate = (data) => {
  const {title, originalTitle, poster, director, writers, actors, description, rating, year, duration, country, genres, age, comments, emojiSelected} = data;
  const date = year.format(`D MMMM YYYY`);

  const genreItem = genres.length > 1 ? `Genres` : `Genre`;
  const commentsList = createCommentsTemplate(comments);
  const emojiList = createEmojiList(emotions, emojiSelected);
  const newComment = createNewCommentTemplate(emojiSelected, emojiList);

  const watchlistButton = createButtonTemplate(`watchlist`, data.isInWatchlist, `Add to watchlist`);
  const historyButton = createButtonTemplate(`watched`, data.isInHistory, `Already watched`);
  const favoriteButton = createButtonTemplate(`favorite`, data.isFavorite, `Add to favorites`);


  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${age}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genreItem}</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${genres}</span>
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          ${watchlistButton}
          ${historyButton}
          ${favoriteButton}
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>
          ${newComment}
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmPopup.parseFilmToData(film);

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this._setEmojiAddHandler();
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          emojiSelected: ``
        }
    );
  }

  static parseDataToFilm(data) {
    let film = Object.assign({}, data);

    delete film.emojiSelected;

    return film;
  }

  reset(film) {
    this.updateData(
        FilmPopup.parseFilmToData(film)
    );
  }


  getTemplate() {
    return createPopupTemplate(this._data);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `IMG`) {
      return;
    }

    this.updateData({
      emojiSelected: evt.target.dataset.id
    });
  }

  setClosePopupHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closePopupHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`#watched`).addEventListener(`change`, this._historyClickHandler);
  }

  _setEmojiAddHandler() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiClickHandler);
  }

  restoreHandlers() {
    this.setClosePopupHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this._setEmojiAddHandler();
  }
}
