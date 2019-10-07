import axios from "axios";
import { GET_SERVERS, DELETE_SERVER, ADD_SERVER, UPDATE_SERVER } from "./types";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "../axios-config";

// GET SERVERS
export const getServers = () => (dispatch, getState) => {
  axios
    .get("/api/servers/", tokenConfig(getState))
    .then(response => {
      dispatch({
        type: GET_SERVERS,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// DELETE SERVER
export const deleteServer = id => (dispatch, getState) => {
  axios
    .delete(`/api/servers/${id}/`, tokenConfig(getState))
    .then(() => {
      dispatch(createMessage({ deleteServer: "Server Deleted" }));
      dispatch({
        type: DELETE_SERVER,
        payload: id
      });
    })
    .catch(err => console.log(err));
};

// ADD SERVER
export const addServer = server => (dispatch, getState) => {
  axios
    .post("/api/servers/", server, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ addServer: "Server Added" }));
      dispatch({
        type: ADD_SERVER,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};

// UPDATE SERVER
export const updateServer = server => (dispatch, getState) => {
  axios
    .put(`/api/servers/${server.id}/`, server, tokenConfig(getState))
    .then(response => {
      dispatch(createMessage({ updateServer: "Server Updated" }));
      dispatch({
        type: UPDATE_SERVER,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status));
    });
};
