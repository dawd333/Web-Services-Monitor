import {view} from "../components/dashboard/DashboardModel";
import {
  CHANGE_VIEW,
  SELECT_SERVICE,
  SET_PINGS,
  SELECT_PING,
  ADD_PING,
  UPDATE_PING,
  DELETE_PING,
  SET_SNMPS,
  SELECT_SNMP,
  ADD_SNMP,
  UPDATE_SNMP,
  DELETE_SNMP, GET_PING_RESULTS
} from "../actions/types";

const initialState = {
  currentView: view.OVERVIEW,
  selectedServiceId: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        currentView: action.payload,
        selectedPing:
          action.payload === view.PING_OVERVIEW || view.EDIT_PING ?
            state.selectedPing : undefined,
        pingResults: undefined,
      };
    case SELECT_SERVICE:
      return {
        ...state,
        selectedServiceId: action.payload
      };
    case SELECT_PING:
      return {
        ...state,
        selectedPing: action.payload
      };
    case SET_PINGS:
      return {
        ...state,
        pings: action.payload
      };
    case ADD_PING:
      return {
        ...state
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    case UPDATE_PING:
      return {
        ...state
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    case DELETE_PING:
      return {
        ...state
        // Do nothing? We want to call GET_PINGS again rather than updating only one item in list
      };
    case GET_PING_RESULTS:
      return {
        ...state,
        pingResults: action.payload,
      };
    case SELECT_SNMP:
      return {
        ...state,
        selectedSnmp: action.payload
      };
    case SET_SNMPS:
      return {
        ...state,
        snmps: action.payload
      };
    case ADD_SNMP:
      return {
        ...state
        // Do nothing? We want to call GET_SNMPS again rather than updating only one item in list
      };
    case UPDATE_SNMP:
      return {
        ...state
        // Do nothing? We want to call GET_SNMPS again rather than updating only one item in list
      };
    case DELETE_SNMP:
      return {
        ...state
        // Do nothing? We want to call GET_SNMPS again rather than updating only one item in list
      };
    default:
      return state;
  }
}
