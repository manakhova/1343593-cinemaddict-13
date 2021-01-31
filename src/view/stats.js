import SmartView from "./smart.js";
import {StatsType, BAR_HEIGHT} from "../const";
import {getUserRank} from "../utils/common";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const getFilmsData = (films, currentFilter) => {
  const currentDate = new Date();
  const weekAgoDate = dayjs().subtract(7, `day`).toDate();
  const monthAgoDate = dayjs().subtract(1, `month`).toDate();
  const yearAgoDate = dayjs().subtract(1, `year`).toDate();
  let watchedFilms = [];

  switch (currentFilter) {
    case StatsType.ALL:
      watchedFilms = films.filter((film) => film.isInHistory);
      break;

    case StatsType.TODAY:
      watchedFilms = films.filter((film) => film.isInHistory && dayjs(film.watchingDate).isSame(currentDate, `day`));
      break;

    case StatsType.WEEK:
      watchedFilms = films.filter((film) => film.isInHistory && dayjs(film.watchingDate).isBetween(weekAgoDate, currentDate));
      break;

    case StatsType.MONTH:
      watchedFilms = films.filter((film) => film.isInHistory && dayjs(film.watchingDate).isBetween(monthAgoDate, currentDate));
      break;

    case StatsType.YEAR:
      watchedFilms = films.filter((film) => film.isInHistory && dayjs(film.watchingDate).isBetween(yearAgoDate, currentDate));
      break;
  }

  const userRank = getUserRank(watchedFilms);

  const totalDuration = watchedFilms.reduce((count, film) => count + film.duration, 0);

  const genres = watchedFilms.reduce((count, film) => {
    film.genres.forEach((genre) => {
      count[genre] = (count[genre] || 0) + 1;
    });
    return count;
  }, {});

  const genresSorted = Object.entries(genres).sort((a, b) => b[1] - a[1]);

  return {watchedFilmsCount: watchedFilms.length, userRank, totalDuration, genres: genresSorted};
};

const getGenres = (genres, index) => {
  return Object.values(genres).map((value) => value[index]);
};

const getName = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderChart = (statisticCtx, genres) => {
  if (genres.length === 0) {
    return null;
  }

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: getGenres(genres, 0),
      datasets: [{
        data: getGenres(genres, 1),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};


const createFilterTemplate = (type, currentFilter) => {
  const name = getName(type).replace(`-`, ` `);

  return `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === currentFilter ? `checked` : ``}>
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`;
};

const createStatsTemplate = (data, currentFilter) => {
  const {watchedFilmsCount, userRank, totalDuration, genres} = data;

  const filterItemsTemplate = Object.values(StatsType).map((type) => createFilterTemplate(type, currentFilter)).join(``);

  const totalHoursDuration = Math.floor(dayjs.duration(totalDuration, `m`).asHours());
  const totalMinutesDuration = dayjs.duration((totalDuration - totalHoursDuration * 60), `m`).asMinutes();

  let topGenre = ``;
  if (genres.length > 0) {
    topGenre = genres[0][0];
  }

  const isEmpty = genres.length === 0 ? `visually-hidden` : ``;

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
      ${filterItemsTemplate}
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${totalHoursDuration} <span class="statistic__item-description">h</span>${totalMinutesDuration}<span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item ${isEmpty}">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap ${isEmpty}">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stats extends SmartView {
  constructor(model) {
    super();

    this._model = model;
    this._currentFilter = StatsType.ALL;
    this._chart = null;
    this._data = {watchedFilmsCount: 0, totalDuration: 0, userRank: ``, genres: []};

    this._handleFiltersChange = this._handleFiltersChange.bind(this);

    this._setCharts();
    this._setFiltersChangeHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data, this._currentFilter);
  }

  rerender() {
    this._data = getFilmsData(this._model.getFilms(), this._currentFilter);
    super.rerender();
    this._renderChart();
  }

  show() {
    super.show();
    this.rerender();
  }

  _renderChart() {
    const chartContainer = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    this._chart = renderChart(chartContainer, this._data.genres);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _setCharts() {
    this._renderChart();
  }

  restoreHandlers() {
    this._setCharts();
    this._setFiltersChangeHandler();
  }

  _handleFiltersChange(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._currentFilter = evt.target.value;

    this.updateData(
        getFilmsData(this._model.getFilms(), this._currentFilter)
    );
  }

  _setFiltersChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._handleFiltersChange);
  }
}
