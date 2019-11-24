import axios from "axios";
import {tokenConfig} from "../axios-config";
import {returnErrors} from "./messages";
import {GET_STATUS_PAGE} from "./types";


// TODO This is copied from dashboard but we have to create new API request for this with some adjustments.
export const getStatusPageResultsForService = serviceId => (dispatch, getState) => {
  return axios
    .get(`/api/services/${serviceId}/`, tokenConfig(getState))
    .then(response => {
      dispatch({
        type: GET_STATUS_PAGE,
        payload: response.data
      });
      return true;
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
      return false;
    });
};