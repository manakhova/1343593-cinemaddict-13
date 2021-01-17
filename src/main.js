import {render, RenderPosition} from "./utils/render";
import ProfileView from "./view/profile";
import SiteMenuView from "./view/site-menu";
import FilterView from "./view/filter";
import StatsView from "./view/stats";
import SortView from "./view/sorting";
import {generateFilm} from "./mock/film-mock";
import {generateFilter} from "./mock/filter-mock";
import FilmsListPresenter from "./presenter/films-list.js";

const FILMS_COUNT = 21;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteMainElement = document.querySelector(`.main`);
const headerMainElement = document.querySelector(`.header`);

render(headerMainElement, new ProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const menuContainer = siteMainElement.querySelector(`.main-navigation`);

render(menuContainer, new FilterView(filters), RenderPosition.BEFOREEND);
render(menuContainer, new StatsView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(siteMainElement);
filmsListPresenter.init(films);
