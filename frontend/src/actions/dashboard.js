import {CHANGE_VIEW, SELECT_SERVICE} from "./types";


export const selectService = serviceId => {
  return {
    type: SELECT_SERVICE,
    payload: serviceId,
  };
};

export const changeView = view => {
  return {
    type: CHANGE_VIEW,
    payload: view,
  };
};