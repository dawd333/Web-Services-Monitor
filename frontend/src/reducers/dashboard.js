import {view} from "../components/dashboard/DashboardModel";
import {ADD_PING, CHANGE_VIEW, DELETE_PING, GET_PINGS, SELECT_SERVICE, UPDATE_PING} from "../actions/types";


const initialState = {
  currentView: view.OVERVIEW,
  selectedServiceId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        currentView: action.payload,
      };
    case SELECT_SERVICE:
      return {
        ...state,
        selectedServiceId: action.payload,
      };
      case GET_PINGS:
      return {
        ...state,
        pings: action.payload,
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