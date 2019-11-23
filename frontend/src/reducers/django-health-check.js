import { GET_DJANGO_HEALTH_CHECK_RESULTS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DJANGO_HEALTH_CHECK_RESULTS:
      return {
        ...initialState,
        results: action.payload
      };
    default:
      return state;
  }
}
