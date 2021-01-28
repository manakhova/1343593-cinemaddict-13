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
import {MenuItem, FilterType} from "./const.js";

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

const siteMenuComponent = new SiteMenuView();

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);

// render(siteMenuComponent, new StatsView(), RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      filmListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filmListPresenter.destroy();
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
filmListPresenter.init();
