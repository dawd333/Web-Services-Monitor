import {
  CHANGE_VIEW,
  SELECT_SERVICE,
  SELECT_PING,
  SET_PINGS,
  ADD_PING,
  UPDATE_PING,
  DELETE_PING,
  GET_PING_RESULTS,
  SELECT_SNMP,
  SET_SNMPS,
  ADD_SNMP,
  UPDATE_SNMP,
  DELETE_SNMP,
  GET_SNMP_RESULTS,
  SELECT_DJANGO_HEALTH_CHECK,
  SET_DJANGO_HEALTH_CHECKS,
  ADD_DJANGO_HEALTH_CHECK,
  UPDATE_DJANGO_HEALTH_CHECK,
  DELETE_DJANGO_HEALTH_CHECK,
  GET_DJANGO_HEALTH_CHECK_RESULTS
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

export const selectDjangoHealthCheck = djangoHealthCheck => {
  return {
    type: SELECT_DJANGO_HEALTH_CHECK,
    payload: djangoHealthCheck
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
      dispatch({
        type: SET_DJANGO_HEALTH_CHECKS,
        payload: response.data.django_health_check_configurations
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
export const getPingResults = (pingId, fromDate, toDate) => async (
  dispatch,
  getState
) => {
  await axios
    .get(`/api/ping-results/${pingId}/`, {
      ...tokenConfig(getState),
      params: { "from-date": fromDate, "to-date": toDate }
    })
    .then(response => {
      dispatch({
        type: GET_PING_RESULTS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
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

// GET SNMP RESULTS
export const getSnmpResults = (snmpId, fromDate, toDate) => async (
  dispatch,
  getState
) => {
  await axios
    .get(`/api/snmp-results/${snmpId}/`, {
      ...tokenConfig(getState),
      params: { "from-date": fromDate, "to-date": toDate }
    })
    .then(response => {
      dispatch({
        type: GET_SNMP_RESULTS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};

// ADD DJANGO HEALTH CHECK
export const addDjangoHealthCheck = (serviceId, djangoHealthCheck) => async (
  dispatch,
  getState
) => {
  let djangoHealthCheckId;
  await axios
    .post(
      `/api/django-health-check/${serviceId}/`,
      djangoHealthCheck,
      tokenConfig(getState)
    )
    .then(response => {
      dispatch(
        createMessage({
          addDjangoHealthCheck: "Django Health Check configuration created"
        })
      );
      dispatch({
        type: ADD_DJANGO_HEALTH_CHECK,
        payload: response.data
      });
      djangoHealthCheckId = response.data.id;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
  return djangoHealthCheckId;
};

// UPDATE DJANGO HEALTH CHECK
export const updateDjangoHealthCheck = (
  serviceId,
  djangoHealthCheckId,
  djangoHealthCheck
) => async (dispatch, getState) => {
  await axios
    .put(
      `/api/django-health-check/${serviceId}/${djangoHealthCheckId}/`,
      djangoHealthCheck,
      tokenConfig(getState)
    )
    .then(response => {
      dispatch(
        createMessage({
          updateDjangoHealthCheck: "Django Health Check configuration updated"
        })
      );
      dispatch({
        type: UPDATE_DJANGO_HEALTH_CHECK,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// DELETE DJANGO HEALTH CHECK
export const deleteDjangoHealthCheck = (
  serviceId,
  djangoHealthCheckId
) => async (dispatch, getState) => {
  await axios
    .delete(
      `/api/django-health-check/${serviceId}/${djangoHealthCheckId}/`,
      tokenConfig(getState)
    )
    .then(() => {
      dispatch(
        createMessage({
          deleteDjangoHealthCheck: "Django Health Check configuration deleted"
        })
      );
      dispatch({
        type: DELETE_DJANGO_HEALTH_CHECK,
        payload: djangoHealthCheckId
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};

// GET DJANGO HEALTH CHECK RESULTS
export const getDjangoHealthCheckResults = (
  djangoHealthCheckId,
  fromDate,
  toDate
) => async (dispatch, getState) => {
  await axios
    .get(`/api/django-health-check-results/${djangoHealthCheckId}/`, {
      ...tokenConfig(getState),
      params: { "from-date": fromDate, "to-date": toDate }
    })
    .then(response => {
      dispatch({
        type: GET_DJANGO_HEALTH_CHECK_RESULTS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};
