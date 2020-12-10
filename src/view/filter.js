import {createElement} from "../utils";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};// как выводить здесь название фильтра по ТЗ, а не технич название фильтра из filter-mock.js?

export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);

  return `<div class="main-navigation__items">${filterItemsTemplate}</div>`;
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
