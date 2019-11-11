import axios from "axios";
import { GET_SNMP_RESULTS } from "./types";
import { returnErrors } from "./messages";
import { tokenConfig } from "../axios-config";

export const getSnmpResults = (snmpId, fromDate, toDate) => async (
  dispatch,
  getState
) => {
  await axios
    .get(`/api/snmp-results/${snmpId}/`, {
      ...tokenConfig(getState),
      params: { "from-date": fromDate, "to-date": toDate }
    })
    .then(response => {
      dispatch({
        type: GET_SNMP_RESULTS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};
