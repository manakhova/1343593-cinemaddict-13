import {render, RenderPosition} from "./utils/render";
import ProfileView from "./view/profile";
import SiteMenuView from "./view/site-menu";
import StatsView from "./view/stats";
import {generateFilm} from "./mock/film-mock";
import {generateComment} from "./mock/comment-mock";
import FilmsListPresenter from "./presenter/films-list";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";

const FILMS_COUNT = 14;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const comments = new Array(4).fill().map(generateComment);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const headerMainElement = document.querySelector(`.header`);
render(headerMainElement, new ProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const menuContainer = siteMainElement.querySelector(`.main-navigation`);

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(menuContainer, filterModel, filmsModel);

render(menuContainer, new StatsView(), RenderPosition.BEFOREEND);

filterPresenter.init();
filmListPresenter.init();
