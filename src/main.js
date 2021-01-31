import {render, RenderPosition} from "./utils/render";
import ProfileView from "./view/profile";
import SiteMenuView from "./view/site-menu";
import FooterStatsView from './view/footer-stats';
import {generateFilm} from "./mock/film-mock";
import {comments} from "./mock/comment-mock";
import FilmsListPresenter from "./presenter/films-list";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const headerMainElement = document.querySelector(`.header`);
render(headerMainElement, new ProfileView(filmsModel.getFilms()), RenderPosition.BEFOREEND);

const footerMainElement = document.querySelector(`.footer`);
render(footerMainElement, new FooterStatsView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);

const siteMenuComponent = new SiteMenuView();

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);

filterPresenter.init();
filmListPresenter.init();
