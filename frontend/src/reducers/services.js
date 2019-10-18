import {
  GET_SERVICES,
  CLEAR_SERVICES,
  ADD_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE
} from "../actions/types";

const initialState = {
  services: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SERVICES:
      return {
        ...state,
        services: action.payload
      };
    case ADD_SERVICE:
      return {
        ...state,
        services: [...state.services, action.payload]
      };
    case UPDATE_SERVICE:
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id
            ? (service = action.payload)
            : service
        )
      };
    case DELETE_SERVICE:
      return {
        ...state,
        services: state.services.filter(
          service => service.id !== action.payload
        )
      };
    case CLEAR_SERVICES:
      return {
        ...state,
        services: []
      };
    default:
      return state;
  }
}
