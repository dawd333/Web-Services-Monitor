import React, {Component} from "react";
import {Container} from "react-bootstrap";
import {connect} from "react-redux";
import {getStatusPageResultsForService} from "../../actions/statuspage";
import {NotFound} from "../notfound/NotFound";
import StatusPageContent from "./statuspagecontent/StatusPageContent";
import styles from "./StatusPageContainer.less";

class StatusPageContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const serviceId = this.props.location.pathname.split("/")[1];
    if (serviceId.match(/^\w+$/)) {
      this.props.getStatusPageResultsForService(serviceId).then(success => {
        this.setState({
          isServiceLoaded: success
        })
      });
    }
  }

  render() {
    return (
      <div className={styles.statusPageContainer}>
        {this.state.isServiceLoaded !== undefined && this.state.isServiceLoaded &&
        this.renderStatusPage()
        }
        {this.state.isServiceLoaded !== undefined && !this.state.isServiceLoaded &&
        this.render404()
        }
      </div>
    )
  }

  renderStatusPage = () => (
    <StatusPageContent/>
  );

  render404 = () => (
    <NotFound
      message={"Couldn't find service with provided id"}
    />
  );

}

const connected = connect(null, {
  getStatusPageResultsForService,
})(StatusPageContainer);
export {connected as StatusPageContainer};
