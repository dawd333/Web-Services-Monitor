import {
  GET_SERVERS,
  DELETE_SERVER,
  ADD_SERVER,
  CLEAR_SERVERS,
  UPDATE_SERVER
} from "../actions/types";

const initialState = {
  servers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SERVERS:
      return {
        ...state,
        servers: action.payload
      };
    case DELETE_SERVER: {
      return {
        ...state,
        servers: state.servers.filter(server => server.id !== action.payload)
      };
    }
    case ADD_SERVER: {
      return {
        ...state,
        servers: [...state.servers, action.payload]
      };
    }
    case CLEAR_SERVERS: {
      return {
        ...state,
        servers: []
      };
    }
    case UPDATE_SERVER: {
      return {
        ...state,
        servers: state.servers.map(server =>
          server.id === action.payload.id ? (server = action.payload) : server
        )
      };
    }
    default:
      return state;
  }
}
