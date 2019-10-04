import { CREATE_MESSAGE } from "./types";

// CREATE MESSAGE
export const createMessage = message => {
  return {
    type: CREATE_MESSAGE,
    payload: message
  };
};
