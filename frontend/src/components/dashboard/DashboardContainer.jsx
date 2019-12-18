import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styles from "./DashboardContainer.less";
import SideNav from "./side-nav/SideNav";
import { view } from "./DashboardModel";
import { Service } from "./DashboardModel";
import { ServiceForm } from "./forms/service-form/ServiceForm";
import {
  addService,
  deleteService,
  getServices,
  updateService
} from "../../actions/services";
import {
  changeView,
  selectService,
  selectPing,
  addPing,
  updatePing,
  selectSnmp,
  addSnmp,
  updateSnmp,
  selectDjangoHealthCheck,
  addDjangoHealthCheck,
  updateDjangoHealthCheck
} from "../../actions/dashboard";
import PingOverview from "./ping-overview/PingOverview";
import SnmpOverview from "./snmp-overview/SnmpOverview";
import DjangoHealthCheckOverview from "./django-health-check-overview/DjangoHealthCheckOverview";
import DashboardContent from "./dashboard-content/DashboardContent";
import PingForm from "./forms/ping-form/PingForm";
import SnmpForm from "./forms/snmp-form/SnmpForm";
import DjangoHealthCheckForm from "./forms/django-health-check-form/DjangoHealthCheckForm";

class DashboardContainer extends React.Component {
  static propTypes = {
    services: PropTypes.objectOf(PropTypes.shape(Service)),
    currentView: PropTypes.oneOf(Object.values(view)),
    selectedServiceId: PropTypes.number,
    selectedPing: PropTypes.object, // TODO Create shape for ping object
    selectedSnmp: PropTypes.object, // TODO Create shape for snmp object
    selectedDjangoHealthCheck: PropTypes.object // TODO Create shape for Django Health Check object
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

  displayContent = props => {
    switch (props.currentView) {
      case view.OVERVIEW:
        if (this.props.selectedServiceId) {
          // This is not clean code :/ Change it when we decide what to display by default
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
          />
        );
      case view.EDIT_PING:
        return (
          <>
            {this.props.selectedPing && (
              <PingForm
                key={this.props.selectedPing.id}
                id={this.props.selectedPing.id}
                label={"Update ping configuration"}
                ip={this.props.selectedPing.ip}
                interval={this.props.selectedPing.interval}
                isActive={this.props.selectedPing.is_active}
                numberOfRequests={this.props.selectedPing.number_of_requests}
                timeout={this.props.selectedPing.timeout}
                statusPageType={this.props.selectedPing.display_type}
                emailNotifications={this.props.selectedPing.email_notifications}
                onSubmit={this.onUpdatePing}
              />
            )}
          </>
        );
      case view.PING_OVERVIEW:
        return (
          <PingOverview
            key={this.props.selectedPing.id}
            pingModel={this.props.selectedPing}
          />
        );
      case view.ADD_SNMP:
        return (
          <SnmpForm
            key={"add_snmp"}
            label={"Add snmp configuration"}
            onSubmit={this.onAddSnmp}
          />
        );
      case view.EDIT_SNMP:
        return (
          <>
            {this.props.selectedSnmp && (
              <SnmpForm
                key={this.props.selectedSnmp.id}
                id={this.props.selectedSnmp.id}
                label={"Update snmp configuration"}
                ip={this.props.selectedSnmp.ip}
                interval={this.props.selectedSnmp.interval}
                isActive={this.props.selectedSnmp.is_active}
                platform={this.props.selectedSnmp.platform}
                username={this.props.selectedSnmp.username}
                onSubmit={this.onUpdateSnmp}
                statusPageType={this.props.selectedSnmp.display_type}
                emailNotifications={this.props.selectedSnmp.email_notifications}
              />
            )}
          </>
        );
      case view.SNMP_OVERVIEW:
        return (
          <SnmpOverview
            key={this.props.selectedSnmp.id}
            snmpModel={this.props.selectedSnmp}
          />
        );

      case view.ADD_DJANGO_HEALTH_CHECK:
        return (
          <DjangoHealthCheckForm
            key={"add_django_health_check"}
            label={"Add Health Check configuration"}
            onSubmit={this.onAddDjangoHealthCheck}
          />
        );
      case view.EDIT_DJANGO_HEALTH_CHECK:
        return (
          <>
            {this.props.selectedDjangoHealthCheck && (
              <DjangoHealthCheckForm
                key={this.props.selectedDjangoHealthCheck.id}
                id={this.props.selectedDjangoHealthCheck.id}
                label={"Update Django Health Check configuration"}
                url={this.props.selectedDjangoHealthCheck.url}
                interval={this.props.selectedDjangoHealthCheck.interval}
                isActive={this.props.selectedDjangoHealthCheck.is_active}
                statusPageType={this.props.selectedDjangoHealthCheck.display_type}
                emailNotifications={this.props.selectedDjangoHealthCheck.email_notifications}
                onSubmit={this.onUpdateDjangoHealthCheck}
              />
            )}
          </>
        );
      case view.DJANGO_HEALTH_CHECK_OVERVIEW:
        return (
          <DjangoHealthCheckOverview
            key={this.props.selectedDjangoHealthCheck.id}
            djangoHealthCheckModel={this.props.selectedDjangoHealthCheck}
          />
        );
      default:
        return <div>{"DEFAULT VIEW"}</div>;
    }
  };

  onAddService = async service => {
    const newServiceId = await this.props.addService(service);
    if (newServiceId) {
      this.props.selectService(newServiceId);
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdateService = async service => {
    await this.props.updateService(this.props.selectedServiceId, service);
    this.props.changeView(view.OVERVIEW);
  };

  onAddPing = async ping => {
    const newPingId = await this.props.addPing(
      this.props.selectedServiceId,
      ping
    );
    if (newPingId) {
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdatePing = async ping => {
    await this.props.updatePing(
      this.props.selectedServiceId,
      this.props.selectedPing.id,
      ping
    );
    this.props.selectPing(undefined);
    this.props.changeView(view.OVERVIEW);
  };

  onAddSnmp = async snmp => {
    const newSnmpId = await this.props.addSnmp(
      this.props.selectedServiceId,
      snmp
    );
    if (newSnmpId) {
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdateSnmp = async snmp => {
    await this.props.updateSnmp(
      this.props.selectedServiceId,
      this.props.selectedSnmp.id,
      snmp
    );
    this.props.selectSnmp(undefined);
    this.props.changeView(view.OVERVIEW);
  };

  onAddDjangoHealthCheck = async djangoHealthCheck => {
    const newDjangoHealthCheckId = await this.props.addDjangoHealthCheck(
      this.props.selectedServiceId,
      djangoHealthCheck
    );
    if (newDjangoHealthCheckId) {
      this.props.changeView(view.OVERVIEW);
    }
  };

  onUpdateDjangoHealthCheck = async djangoHealthCheck => {
    await this.props.updateDjangoHealthCheck(
      this.props.selectedServiceId,
      this.props.selectedDjangoHealthCheck.id,
      djangoHealthCheck
    );
    this.props.selectDjangoHealthCheck(undefined);
    this.props.changeView(view.OVERVIEW);
  };

  retrieveSelectedService = () => {
    const service = Object.values(this.props.services).find(
      service => service.id === this.props.selectedServiceId
    );
    return service ? service : { name: "" };
  };
}

const mapStateToProps = state => ({
  services: state.services.services,
  currentView: state.dashboard.currentView,
  selectedServiceId: state.dashboard.selectedServiceId,
  selectedPing: state.dashboard.selectedPing,
  selectedSnmp: state.dashboard.selectedSnmp,
  selectedDjangoHealthCheck: state.dashboard.selectedDjangoHealthCheck
});

const connected = connect(mapStateToProps, {
  changeView,
  getServices,
  selectService,
  addService,
  updateService,
  deleteService,
  selectPing,
  addPing,
  updatePing,
  selectSnmp,
  addSnmp,
  updateSnmp,
  selectDjangoHealthCheck,
  addDjangoHealthCheck,
  updateDjangoHealthCheck
})(DashboardContainer);
export { connected as DashboardContainer };
