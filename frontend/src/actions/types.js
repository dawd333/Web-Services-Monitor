import PropTypes from "prop-types";

export const GET_SERVERS = "GET_SERVERS";
export const DELETE_SERVER = "DELETE_SERVER";
export const ADD_SERVER = "ADD_SERVER";
export const CLEAR_SERVERS = "CLEAR_SERVERS";
export const UPDATE_SERVER = "UPDATE_SERVER";

export const GET_ERRORS = "GET_ERRORS";
export const CREATE_MESSAGE = "CREATE_MESSAGE";

export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

// TODO I'm trying to emulate types from TypeScript. Let's check in a few days if this is a good approach.
export const Service = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}