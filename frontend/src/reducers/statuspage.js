import {GET_STATUS_PAGE} from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STATUS_PAGE:
      return {
        ...initialState,
        data: action.payload
      };
    default:
      return state;
  }
}