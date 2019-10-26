import {
  GET_PINGS,
  ADD_PING,
  UPDATE_PING,
  DELETE_PING
} from "../actions/types";

const initialState = {
  services: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PINGS:
      return {
        ...state,
        services: {
          [action.payload.service]: {
            ...state.services[action.payload.service],
            pings: action.payload,
          },
        }
      };
    case ADD_PING:
      return {
        ...state,
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    case UPDATE_PING:
      return {
        ...state,
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    case DELETE_PING:
      return {
        ...state,
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    default:
      return state;
  }
}
