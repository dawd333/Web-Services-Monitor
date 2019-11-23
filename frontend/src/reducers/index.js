import { combineReducers } from "redux";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import services from "./services";
import dashboard from "./dashboard";
import ping from "./ping";
import snmp from "./snmp";
import djangoHealthCheck from "./django-health-check";

export default combineReducers({
  dashboard,
  errors,
  messages,
  auth,
  services,
  ping,
  snmp,
  djangoHealthCheck
});
