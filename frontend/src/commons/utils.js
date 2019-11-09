import moment from "moment";

const UTC_PATTERN = "YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]";
const APP_PATTERN = "DD-MM-YYYY HH:mm:ss";

export const convertFromUTCtoMoment = utc => {
  return moment.utc(utc, UTC_PATTERN);
};

export const convertFromUTC = utc => {
  return convertFromUTCtoMoment(utc).format(APP_PATTERN);
};

export const getCurrentDateUTC = () => {
  return moment().format(UTC_PATTERN);
};

export const getDateFromTodayUTC = diff => {
  return moment().add(diff, 'days').format(UTC_PATTERN);
};

// Date part for charts
export const convertFromUTCtoDate = utc => {
  return moment.utc(utc, UTC_PATTERN).toDate();
};

export const convertFromUTCtoDateWithSecondsDifference = (utc, diff) => {
  diff = diff ? diff : 0;
  return moment.utc(utc, UTC_PATTERN).add(diff, 'seconds').toDate();
};

