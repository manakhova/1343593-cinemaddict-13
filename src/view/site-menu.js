import AbstractView from "./abstract";

const createSiteMemuContainerTemplate = () => {
  return `<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional" data-filter="stats">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMemuContainerTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }

    this._callback.menuClick(evt.target.dataset.filter);

    if (evt.target.dataset.filter === `stats`) {
      evt.target.classList.add(`main-navigation__item--active`);
      this.getElement().querySelectorAll(`.main-navigation__item `).forEach((a) => {
        a.classList.remove(`main-navigation__item--active`);
      });
    } else {
      this.getElement().querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
