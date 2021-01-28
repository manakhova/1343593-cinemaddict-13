import AbstractView from "./abstract";

const createSiteMemuContainerTemplate = () => {
  return `<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional" data-filter="stats>Stats</a>
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

    this._callback.menuClick(evt.target);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
