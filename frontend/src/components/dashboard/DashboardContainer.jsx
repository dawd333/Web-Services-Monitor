import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import styles from "./DashboardContainer.less";
import SideNav from "./sidenav/SideNav";
import {view} from "./DashboardModel";
import {Service} from "./DashboardModel";
import {ServiceForm} from "./forms/serviceform/ServiceForm";
import {addService, deleteService, getServices, updateService} from "../../actions/services";
import {changeView, selectService} from "../../actions/dashboard";
import {PingForm} from "./forms/pingform/PingForm";
import {addPing, updatePing} from "../../actions/ping";
import DashboardContent from "./dashboardcontent/DashboardContent";

class DashboardContainer extends React.Component {
  static propTypes = {
    services: PropTypes.objectOf(PropTypes.shape(Service)),
    currentView: PropTypes.oneOf(Object.values(view)),
    selectedServiceId: PropTypes.number,
    selectService: PropTypes.func.isRequired,
    getServices: PropTypes.func.isRequired,
    addService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
    addPing: PropTypes.func.isRequired,
    updatePing: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getServices();
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <SideNav
          services={this.props.services}
          selectedServiceId={this.props.selectedServiceId}
          onUpdateService={this.onUpdateService}
        />
        <div className={styles.container}>
          {this.displayContent(this.props)}
        </div>
      </div>
    );
  }

  displayContent = (props) => {
    switch (props.currentView) {
      case view.OVERVIEW:
        return (<DashboardContent/>);
      case view.ADD_SERVICE:
        return (
          <ServiceForm
            label={"Add service"}
            onSubmit={this.onAddService}
          />
        );
      case view.EDIT_SERVICE:
        return (
          <ServiceForm
            label={"Update service"}
            name={this.retrieveSelectedService().name}
            onSubmit={this.onUpdateService}
          />
        );
      case view.ADD_PING:
        return (<PingForm
          label={"Add ping configuration"}
          ip={""}
          interval={1000}
          isActive={false}
          numberOfRequests={4}
          onSubmit={this.onAddPing}
        />);
      default:
        return (<div>{"DEFAULT VIEW"}</div>)
    }
  };

  onAddService = async (service) => {
    const newServiceId = await this.props.addService(service);
    console.log(newServiceId);
    if (newServiceId) {
      this.props.selectService(newServiceId);
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdateService = async (service) => {
    await this.props.updateService(this.props.selectedServiceId, service);
    this.props.changeView(view.OVERVIEW);
  };

  onAddPing = async (ping) => {
    const newPingId = await this.props.addPing(this.props.selectedServiceId, ping);
    if (newPingId) {
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdatePing = async (ping) => {
    await this.props.updatePing(this.props.selectedServiceId, ping);
    this.props.changeView(view.OVERVIEW);
  };

  retrieveSelectedService = () => {
    const service = Object.values(this.props.services).find(service => service.id === this.props.selectedServiceId);
    return service ? service : {name: ""};
  }
}


const mapStateToProps = state => ({
  services: state.services.services,
  currentView: state.dashboard.currentView,
  selectedServiceId: state.dashboard.selectedServiceId,
});

const connected = connect(
  mapStateToProps,
  {
    selectService,
    changeView,
    getServices,
    addService,
    deleteService,
    updateService,
    addPing,
    updatePing,
  },
)(DashboardContainer);
export {connected as DashboardContainer}
