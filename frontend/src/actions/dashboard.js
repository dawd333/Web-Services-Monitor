import {
  CHANGE_VIEW,
  SELECT_SERVICE,
  SELECT_PING,
  SET_PINGS,
  ADD_PING,
  UPDATE_PING,
  DELETE_PING,
  SELECT_SNMP,
  SET_SNMPS,
  ADD_SNMP,
  UPDATE_SNMP,
  DELETE_SNMP,
  GET_PING_RESULTS
} from "./types";
import axios from "axios";
import { tokenConfig } from "../axios-config";
import { createMessage, returnErrors } from "./messages";

export const selectService = serviceId => {
  return {
    type: SELECT_SERVICE,
    payload: serviceId
  };
};

export const selectPing = ping => {
  return {
    type: SELECT_PING,
    payload: ping
  };
};

export const selectSnmp = snmp => {
  return {
    type: SELECT_SNMP,
    payload: snmp
  };
};

export const changeView = view => {
  return {
    type: CHANGE_VIEW,
    payload: view
  };
};

// GET SERVICE WITH CONFIGURATIONS
export const getServiceWithConfigurations = serviceId => (
  dispatch,
  getState
) => {
  axios
    .get(`/api/services/${serviceId}/`, tokenConfig(getState))
    .then(response => {
      dispatch({
        type: SET_PINGS,
        payload: response.data.ping_configurations
      });
      dispatch({
        type: SET_SNMPS,
        payload: response.data.snmp_configurations
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// ADD PING
export const addPing = (serviceId, ping) => async (dispatch, getState) => {
  let pingId;
  await axios
    .post(`/api/ping/${serviceId}/`, ping, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ addPing: "Ping configuration created" }));
      dispatch({
        type: ADD_PING,
        payload: response.data
      });
      pingId = response.data.id;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
  return pingId;
};

// UPDATE PING
export const updatePing = (serviceId, pingId, ping) => async (
  dispatch,
  getState
) => {
  await axios
    .put(`/api/ping/${serviceId}/${pingId}/`, ping, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ updatePing: "Ping configuration updated" }));
      dispatch({
        type: UPDATE_PING,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// DELETE PING
export const deletePing = (serviceId, pingId) => async (dispatch, getState) => {
  await axios
    .delete(`/api/ping/${serviceId}/${pingId}/`, tokenConfig(getState))
    .then(() => {
      dispatch(createMessage({ deletePing: "Ping configuration deleted" }));
      dispatch({
        type: DELETE_PING,
        payload: pingId
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};

// GET PING RESULTS
export const getPingResults = (pingId, fromDate, toDate) => async (dispatch, getState) => {
  await axios
    .get(`/api/ping-results/${pingId}/`,
      {...tokenConfig(getState), params: {'from-date': fromDate, 'to-date': toDate}})
    .then(response => {
      dispatch({
        type: GET_PING_RESULTS,
        payload: response.data,
      });
    })
    .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

// ADD SNMP
export const addSnmp = (serviceId, snmp) => async (dispatch, getState) => {
  let snmpId;
  await axios
    .post(`/api/snmp/${serviceId}/`, snmp, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ addSnmp: "Snmp configuration created" }));
      dispatch({
        type: ADD_SNMP,
        payload: response.data
      });
      snmpId = response.data.id;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
  return snmpId;
};

// UPDATE SNMP
export const updateSnmp = (serviceId, snmpId, snmp) => async (
  dispatch,
  getState
) => {
  await axios
    .put(`/api/snmp/${serviceId}/${snmpId}/`, snmp, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ updateSnmp: "Snmp configuration updated" }));
      dispatch({
        type: UPDATE_SNMP,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// DELETE SNMP
export const deleteSnmp = (serviceId, snmpId) => async (dispatch, getState) => {
  await axios
    .delete(`/api/snmp/${serviceId}/${snmpId}/`, tokenConfig(getState))
    .then(() => {
      dispatch(createMessage({ deleteSnmp: "Snmp configuration deleted" }));
      dispatch({
        type: DELETE_SNMP,
        payload: snmpId
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};
