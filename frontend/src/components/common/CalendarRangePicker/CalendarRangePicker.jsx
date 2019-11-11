import React from "react";
import {connect} from "react-redux";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import styles from "./CalendarRangePicker.less"
import PropTypes from "prop-types";

class CalendarRangePicker extends React.Component {
  static propTypes = {
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <>
        <DateRangePicker
          className={styles.calendarRangePicker}
          calendarClassName={styles.calendarRangePicker__calendar}
          onChange={this.onChange}
          value={[this.props.fromDate, this.props.toDate]}
          locale={"en-EN"}
          clearIcon={null}
          format={"dd/MM/yyyy"}
          showLeadingZeros={true}
          maxDate={new Date()}
        />
      </>
    )
  }

  onChange = date => {
    this.setState({date});
    if (date[0] && date[1]) {
      this.props.onChange(date[0], date[1]);
    }
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(CalendarRangePicker);
