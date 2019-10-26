import axios from "axios";
import {
  GET_SERVICES,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE
} from "./types";
import {createMessage, returnErrors} from "./messages";
import {tokenConfig} from "../axios-config";

// GET SERVICES
export const getServices = () => (dispatch, getState) => {
  console.log(tokenConfig(getState));
  fetchServices(dispatch, getState);
};

// ADD SERVICE
export const addService = service => async (dispatch, getState) => {
  return await axios
    .post("/api/services/", service, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({addService: "Service Added"}));
      dispatch({
        type: ADD_SERVICE,
        payload: response.data
      });
      return response.data.id;
    })
    .then((serviceId) => {
      fetchServices(dispatch, getState);
      return serviceId;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// UPDATE SERVICE
export const updateService = (serviceId, service) => (dispatch, getState) => {
  axios
    .put(`/api/services/${serviceId}/`, service, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({updateService: "Service Updated"}));
      dispatch({
        type: UPDATE_SERVICE,
        payload: response.data
      });
    })
    .then(() => fetchServices(dispatch, getState))
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// DELETE SERVICE
export const deleteService = id => (dispatch, getState) => {
  axios
    .delete(`/api/services/${id}/`, tokenConfig(getState))
    .then(() => {
      dispatch(createMessage({deleteService: "Service Deleted"}));
      dispatch({
        type: DELETE_SERVICE,
        payload: id
      });
    })
    .then(() => fetchServices(dispatch, getState))
    .catch(error => console.log(error));
};

const fetchServices = (dispatch, getState) => {
  axios
    .get("/api/services/", tokenConfig(getState))
    .then(response => {
      dispatch({
        type: GET_SERVICES,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
}