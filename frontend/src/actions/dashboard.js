import {ADD_PING, CHANGE_VIEW, DELETE_PING, GET_PINGS, SELECT_PING, SELECT_SERVICE, UPDATE_PING} from "./types";
import axios from "axios";
import {tokenConfig} from "../axios-config";
import {createMessage, returnErrors} from "./messages";


export const selectService = serviceId => {
  return {
    type: SELECT_SERVICE,
    payload: serviceId,
  };
};

export const selectPing = ping => {
  return {
    type: SELECT_PING,
    payload: ping,
  };
};

export const changeView = view => {
  return {
    type: CHANGE_VIEW,
    payload: view,
  };
};

// GET PINGS
export const getPings = serviceId => (dispatch, getState) => {
  axios
    .get(`/api/ping/${serviceId}/`, tokenConfig(getState))
    .then(response => {
      dispatch({
        type: GET_PINGS,
        payload: response.data,
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
      dispatch(createMessage({addService: "Ping configuration created"}));
      dispatch({
        type: ADD_PING,
        payload: response.data,
      });
      pingId = response.data.id;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
  getPings(serviceId);
  return pingId;
};

// UPDATE PING
export const updatePing = (serviceId, pingId, ping) => async (dispatch, getState) => {
  await axios
    .put(`/api/ping/${serviceId}/${pingId}/`, ping, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({updateService: "Ping configuration updated"}));
      dispatch({
        type: UPDATE_PING,
        payload: response.data,
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
  getPings(serviceId);
};

// DELETE PING
export const deletePing = (serviceId, pingId) => async (dispatch, getState) => {
  await axios
    .delete(`/api/services/${serviceId}/${pingId}/`, tokenConfig(getState))
    .then(() => {
      dispatch(createMessage({deleteService: "Ping configuration deleted"}));
      dispatch({
        type: DELETE_PING,
        payload: pingId,
      });
    })
    .catch(error => console.log(error));
  getPings(serviceId);
};