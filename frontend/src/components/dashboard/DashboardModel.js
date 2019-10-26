import PropTypes from "prop-types";

export const view = {
  OVERVIEW: "OVERVIEW",
  ADD_SERVICE: "ADD_SERVICE",
  EDIT_SERVICE: "EDIT_SERVICE",
  PING_OVERVIEW: "PING_OVERVIEW",
  ADD_PING: "ADD_PING",
  EDIT_PING: "EDIT_PING",
};

export const Service = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired
};
