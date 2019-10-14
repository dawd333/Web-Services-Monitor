import { combineReducers } from "redux";
import servers from "./servers";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import services from "./services";

export default combineReducers({
  servers,
  errors,
  messages,
  auth,
  services
});
