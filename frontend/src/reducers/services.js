import {
  GET_SERVICES,
  CLEAR_SERVICES,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE
} from "../actions/types";

const initialState = {
  services: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SERVICES:
      return {
        ...state,
        services: action.payload.reduce((map, service) => {
          map[service.id] = service;
          return map;
        }, {})
      };
    case ADD_SERVICE:
      return {
        ...state,
        // Do nothing? We want to call GET_SERVICES again rather than updating only one item in list
      };
    case UPDATE_SERVICE:
      return {
        ...state,
        // Do nothing? We want to call GET_SERVICES again rather than updating only one item in list
      };
    case DELETE_SERVICE:
      return {
        ...state,
        // Do nothing? We want to call GET_SERVICES again rather than updating only one item in list
      };
    case CLEAR_SERVICES:
      return {
        ...state,
        services: []
      };
    default:
      return state;
  }
}
