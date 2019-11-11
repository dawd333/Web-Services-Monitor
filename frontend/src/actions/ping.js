/* MOVED TO DASHBOARD.JS */

import axios from "axios";
import {
  GET_PINGS,
  ADD_PING,
  UPDATE_PING,
  DELETE_PING,
  GET_PING_RESULTS,
} from "./types";
import {createMessage, returnErrors} from "./messages";
import {tokenConfig} from "../axios-config";


// // GET PINGS
// export const getPings = serviceId => (dispatch, getState) => {
//   axios
//     .get(`/api/ping/${serviceId}/`, tokenConfig(getState))
//     .then(response => {
//       console.log("here");
//       dispatch({
//         type: GET_PINGS,
//         payload: response.data,
//       });
//     })
//     .catch(error => {
//       dispatch(returnErrors(error.response.data, error.response.status));
//     });
// };
//
// // ADD PING
// export const addPing = (serviceId, ping) => async (dispatch, getState) => {
//   let pingId;
//   console.log(ping);
//   await axios
//     .post(`/api/ping/${serviceId}/`, ping, tokenConfig(getState))
//     .then(response => {
//       dispatch(createMessage({addService: "Ping configuration created"}));
//       dispatch({
//         type: ADD_PING,
//         payload: response.data,
//       });
//       pingId = response.data.id;
//     })
//     .catch(error => {
//       dispatch(returnErrors(error.response.data, error.response.status));
//     });
//   getPings(serviceId);
//   return pingId;
// };
//
// // UPDATE PING
// export const updatePing = (serviceId, ping) => async (dispatch, getState) => {
//   await axios
//     .put(`/api/ping/${serviceId}/`, ping, tokenConfig(getState))
//     .then(response => {
//       dispatch(createMessage({updateService: "Ping configuration updated"}));
//       dispatch({
//         type: UPDATE_PING,
//         payload: response.data,
//       });
//     })
//     .catch(error => {
//       dispatch(returnErrors(error.response.data, error.response.status));
//     });
//   getPings(serviceId);
// };
//
// // DELETE PING
// export const deletePing = (serviceId, pingId) => async (dispatch, getState) => {
//   await axios
//     .delete(`/api/services/${serviceId}/${pingId}/`, tokenConfig(getState))
//     .then(() => {
//       dispatch(createMessage({deleteService: "Ping configuration deleted"}));
//       dispatch({
//         type: DELETE_PING,
//         payload: pingId,
//       });
//     })
//     .catch(error => console.log(error));
//   getPings(serviceId);
// };

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