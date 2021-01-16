import AbstractView from "./abstract";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);

  return `<div class="main-navigation__items">${filterItemsTemplate}</div>`;
};

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
