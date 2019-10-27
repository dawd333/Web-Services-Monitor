import moment from "moment"

const UTC_PATTERN = "YYYY-MM-DDThh:mm:ss.sTZD";
const APP_PATTERN = "DD-MM-YYYY hh:mm:ss";

export const convertFromUTC = (utc) => {
  return moment.utc(utc).format(APP_PATTERN)
};

