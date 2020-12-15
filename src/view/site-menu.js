import AbstractView from "./abstract";

const createSiteMemuContainerTemplate = () => {
  return `<nav class="main-navigation"></nav>`;
};

export default class SiteMenu extends AbstractView {
  getTemplate() {
    return createSiteMemuContainerTemplate();
  }
}
