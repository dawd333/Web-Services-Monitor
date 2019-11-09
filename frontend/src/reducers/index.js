import { combineReducers } from "redux";
import servers from "./servers";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import services from "./services";
import dashboard from "./dashboard";
import ping from "./ping";

export default combineReducers({
  dashboard,
  servers,
  errors,
  messages,
  auth,
  services,
  ping
});
