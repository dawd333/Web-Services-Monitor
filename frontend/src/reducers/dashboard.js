import {view} from "../components/dashboard/DashboardModel";
import {CHANGE_VIEW, SELECT_SERVICE} from "../actions/types";


const initialState = {
  currentView: view.OVERVIEW,
  selectedServiceId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        currentView: action.payload,
      };
    case SELECT_SERVICE:
      return {
        ...state,
        selectedServiceId: action.payload,
      };
    default:
      return state;
  }
}