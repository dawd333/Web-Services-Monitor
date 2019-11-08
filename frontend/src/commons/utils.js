import moment from "moment";

const UTC_PATTERN = "YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]";
const APP_PATTERN = "DD-MM-YYYY HH:mm:ss";

export const convertFromUTC = utc => {
  return moment.utc(utc, UTC_PATTERN).format(APP_PATTERN);
};
