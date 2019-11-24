import axios from "axios";
import {tokenConfig} from "../axios-config";
import {returnErrors} from "./messages";
import {GET_STATUS_PAGE} from "./types";


export const getStatusPageResultsForService = serviceId => (dispatch, getState) => {
  return axios
    .get(`/api/status-page/${serviceId}/`, tokenConfig(getState))
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