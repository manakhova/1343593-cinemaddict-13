import {getUserRank} from "../utils/common";
import SmartView from "./smart";

const createProfileTemplate = (films) => {
  return `<section class="header__profile profile ${getUserRank(films) === `` ? `visually-hidden` : ``}">
    <p class="profile__rating">${getUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};


export default class SiteProfile extends SmartView {
  constructor(model) {
    super();

    this._model = model;
    this._data = this._model.getFilms();
  }

  getTemplate() {
    return createProfileTemplate(this._data);
  }

  rerender() {
    this._data = this._model.getFilms();
    super.rerender();
  }

}

