import axios from "axios";
import { GET_DJANGO_HEALTH_CHECK_RESULTS } from "./types";
import { returnErrors } from "./messages";
import { tokenConfig } from "../axios-config";

export const getDjangoHealthCheckResults = (
  djangoHealthCheckId,
  fromDate,
  toDate
) => async (dispatch, getState) => {
  await axios
    .get(`/api/django-health-check-results/${djangoHealthCheckId}/`, {
      ...tokenConfig(getState),
      params: { "from-date": fromDate, "to-date": toDate }
    })
    .then(response => {
      dispatch({
        type: GET_DJANGO_HEALTH_CHECK_RESULTS,
        payload: response.data
      });
    })
    .catch(error =>
      dispatch(returnErrors(error.response.data, error.response.status))
    );
};
