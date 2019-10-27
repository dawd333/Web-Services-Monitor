import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import styles from "./DashboardContainer.less";
import SideNav from "./sidenav/SideNav";
import {view} from "./DashboardModel";
import {Service} from "./DashboardModel";
import {ServiceForm} from "./forms/serviceform/ServiceForm";
import {addService, deleteService, getServices, updateService} from "../../actions/services";
import {addPing, changeView, selectPing, selectService, updatePing} from "../../actions/dashboard";
import {PingForm} from "./forms/pingform/PingForm";
import DashboardContent from "./dashboardcontent/DashboardContent";

class DashboardContainer extends React.Component {
  static propTypes = {
    services: PropTypes.objectOf(PropTypes.shape(Service)),
    currentView: PropTypes.oneOf(Object.values(view)),
    selectedServiceId: PropTypes.number,
    selectedPing: PropTypes.object, // TODO Create shape for ping object
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
        if (this.props.selectedServiceId) { // This is not clean code :/ Change it when we decide what to display by default
          return (
            <DashboardContent
              key={this.props.selectedServiceId}
              serviceId={this.props.selectedServiceId}
            />
          );
        }
        break;
      case view.ADD_SERVICE:
        return (
          <ServiceForm
            key={"add_service"}
            label={"Add service"}
            onSubmit={this.onAddService}
          />
        );
      case view.EDIT_SERVICE:
        return (
          <ServiceForm
            key={"edit_" + this.retrieveSelectedService().name}
            label={"Update service"}
            name={this.retrieveSelectedService().name}
            onSubmit={this.onUpdateService}
          />
        );
      case view.ADD_PING:
        return (
          <PingForm
            key={"add_ping"}
            label={"Add ping configuration"}
            onSubmit={this.onAddPing}
          />);
      case view.EDIT_PING:
        return (
          <>
            {this.props.selectedPing &&
            <PingForm
              key={this.props.selectedPing.id}
              label={"Update ping configuration"}
              ip={this.props.selectedPing.ip}
              interval={this.props.selectedPing.interval}
              isActive={this.props.selectedPing.is_active}
              numberOfRequests={this.props.selectedPing.number_of_requests}
              timeout={this.props.selectedPing.timeout}
              onSubmit={this.onUpdatePing}
            />
            }
          </>);
      default:
        return (<div>{"DEFAULT VIEW"}</div>)
    }
  };

  onAddService = async (service) => {
    const newServiceId = await this.props.addService(service);
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
    await this.props.updatePing(this.props.selectedServiceId, this.props.selectedPing.id, ping);
    this.props.selectPing(undefined);
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
  selectedPing: state.dashboard.selectedPing,
});

const connected = connect(
  mapStateToProps,
  {
    selectService,
    selectPing,
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
