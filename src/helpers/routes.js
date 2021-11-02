const API_BASE_URL = `https://collectionapi.metmuseum.org`;

export const routeGetObjects = `/public/collection/v1/objects`;
export const routeGetObject = `/public/collection/v1/objects/:objectID`;
export const routeGetDepartments = `/public/collection/v1/departments`;

export const parseApiRoute = (url, params = {}) => {
  let route = `${API_BASE_URL}${url}`;

  for (let param of Object.keys(params)) {
    route = route.replace(`:${param}`, params[param]);
  }

  return route;
};
