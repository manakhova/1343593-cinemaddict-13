import AbstractView from "./abstract";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href="#${name}" data-filter="${type}" class="main-navigation__item ${type === currentFilterType ? `main-navigation__item--active` : ``}" >
            ${name}<span class="main-navigation__item-count ${type === `all` ? `visually-hidden` : ``}">${count}</span>
          </a>`;
};

export const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);

  return `<div class="main-navigation__items">${filterItemsTemplate}</div>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
