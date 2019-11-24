import { view } from "../components/dashboard/DashboardModel";
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
  DELETE_SNMP,
  SET_DJANGO_HEALTH_CHECKS,
  SELECT_DJANGO_HEALTH_CHECK,
  ADD_DJANGO_HEALTH_CHECK,
  UPDATE_DJANGO_HEALTH_CHECK,
  DELETE_DJANGO_HEALTH_CHECK,
  GET_PING_RESULTS,
  GET_SNMP_RESULTS,
  GET_DJANGO_HEALTH_CHECK_RESULTS
} from "../actions/types";

const initialState = {
  currentView: view.OVERVIEW,
  selectedServiceId: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        currentView: action.payload,
        selectedPing:
          action.payload === view.PING_OVERVIEW || view.EDIT_PING
            ? state.selectedPing
            : undefined,
        pingResults: undefined,
        selectedSnmp:
          action.payload === view.SNMP_OVERVIEW || view.EDIT_SNMP
            ? state.selectedSnmp
            : undefined,
        snmpResults: undefined,
        selectedDjangoHealthCheck:
          action.payload === view.DJANGO_HEALTH_CHECK_OVERVIEW ||
          view.EDIT_DJANGO_HEALTH_CHECK
            ? state.selectedDjangoHealthCheck
            : undefined,
        djangoHealthCheckResults: undefined
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
    case GET_PING_RESULTS:
      return {
        ...state,
        pingResults: action.payload
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
    case GET_SNMP_RESULTS:
      return {
        ...state,
        snmpResults: action.payload
      };
    case SELECT_DJANGO_HEALTH_CHECK:
      return {
        ...state,
        selectedDjangoHealthCheck: action.payload
      };
    case SET_DJANGO_HEALTH_CHECKS:
      return {
        ...state,
        djangoHealthChecks: action.payload
      };
    case GET_DJANGO_HEALTH_CHECK_RESULTS:
      return {
        ...state,
        djangoHealthCheckResults: action.payload
      };
    case ADD_PING:
    case UPDATE_PING:
    case DELETE_PING:
    case ADD_SNMP:
    case UPDATE_SNMP:
    case DELETE_SNMP:
    case ADD_DJANGO_HEALTH_CHECK:
    case UPDATE_DJANGO_HEALTH_CHECK:
    case DELETE_DJANGO_HEALTH_CHECK:
      return {
        ...state
      };
    default:
      return state;
  }
}
