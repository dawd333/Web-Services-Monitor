import React from "react";
import {connect} from "react-redux";
import {selectService} from "../../../actions/dashboard";

class DashboardContent extends React.Component {
  static propTypes = {

  };

  render() {
    return (
      <>{"Content"}</>
    );
  }
}


const mapStateToProps = state => ({

});

export default connect(
  mapStateToProps,
  {selectService},
)(DashboardContent);
