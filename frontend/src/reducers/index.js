import { combineReducers } from "redux";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import services from "./services";
import dashboard from "./dashboard";
import ping from "./ping";
import snmp from "./snmp";
import statuspage from "./statuspage";

export default combineReducers({
  dashboard,
  errors,
  messages,
  auth,
  services,
  ping,
  snmp,
  statuspage,
});
