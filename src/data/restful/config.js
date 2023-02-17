import fetch from "./fetch";

export const getNavigatorCategories = () => {
  return fetch({ url: `/kvconfig/navigator-categories` });
};

export const getNavigatorSites = () => {
  return fetch({ url: `/kvconfig/navigator-sites` });
};
