import {render, RenderPosition} from "./utils/render";
import ProfileView from "./view/profile";
import SiteMenuView from "./view/site-menu";
import FooterStatsView from './view/footer-stats';
import StatsView from "./view/stats";
import {FilterType, UpdateType} from "./const.js";
import FilmsListPresenter from "./presenter/films-list";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FilterModel from "./model/filter";
import Api from "./api.js";

const AUTHORIZATION = `Basic zksfjgblaisrgaoe8f`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const headerMainElement = document.querySelector(`.header`);
const footerMainElement = document.querySelector(`.footer`);
const siteMainElement = document.querySelector(`.main`);

const filmListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMenuComponent, filterModel, filmsModel);

const statsComponent = new StatsView(filmsModel);
render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
      filmListPresenter.resetSort();
      filmListPresenter.show();
      statsComponent.hide();
      break;
    case FilterType.STATISTICS:
      filmListPresenter.hide();
      statsComponent.show();
      break;
  }
};

filterPresenter.init();
filmListPresenter.init();

api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
  render(headerMainElement, new ProfileView(films), RenderPosition.BEFOREEND);
  render(siteMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
  render(footerMainElement, new FooterStatsView(films.length), RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
})
.catch(() => {
  filmsModel.setFilms(UpdateType.INIT, []);
});
