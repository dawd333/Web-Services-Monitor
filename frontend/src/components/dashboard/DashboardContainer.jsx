import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import styles from "./DashboardContainer.less";
import SideNav from "./sidenav/SideNav";
import {view} from "./DashboardModel";
import {Service} from "./DashboardModel";
import {ServiceForm} from "./serviceform/ServiceForm";
import {addService, deleteService, getServices, updateService} from "../../actions/services";
import {changeView, selectService} from "../../actions/dashboard";

class DashboardContainer extends React.Component {
  static propTypes = {
    services: PropTypes.arrayOf(PropTypes.shape(Service)),
    currentView: PropTypes.oneOf(Object.values(view)),
    selectedServiceId: PropTypes.number,
    selectService: PropTypes.func.isRequired,
    addService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
  };

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
        return (<div>{"OVERVIEW"}</div>);
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
            value={this.retrieveSelectedService().value}
            onSubmit={this.onUpdateService}
          />
        );
      case view.PING_OVERVIEW:
        return (<div>{"PING_OVERVIEW"}</div>);
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
    const serviceWithId = {
      ...service,
      id: this.props.selectedServiceId,
    };
    await this.props.updateService(serviceWithId);
    this.props.changeView(view.OVERVIEW);
  };

  retrieveSelectedService = () => {
    const service = this.props.services.find(service => service.id === this.props.selectedServiceId);
    return service ? service : {name: "", value: 0};
  }
}


const mapStateToProps = state => ({
  services: state.services.services,
  currentView: state.dashboard.currentView,
  selectedServiceId: state.dashboard.selectedServiceId,
});

const connected = connect(
  mapStateToProps,
  {selectService, changeView, getServices, addService, deleteService, updateService},
)(DashboardContainer);
export {connected as DashboardContainer}
