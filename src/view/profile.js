import {getUserRank} from "../utils/common";
import AbstractView from "./abstract";

const createProfileTemplate = (films) => {
  return `<section class="header__profile profile ${getUserRank(films) === `` ? `visually-hidden` : ``}">
    <p class="profile__rating">${getUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};


export default class SiteProfile extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }
}

