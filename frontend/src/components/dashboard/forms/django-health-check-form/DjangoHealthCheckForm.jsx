import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
  changeView,
  deleteDjangoHealthCheck
} from "../../../../actions/dashboard";
import {view} from "../../DashboardModel";
import styles from "../common.less";
import {ButtonToolbar, Container} from "react-bootstrap";
import {DeleteModal} from "../../../common/delete-modal/DeleteModal";
import {STATUS_PAGE_TYPE} from "../../../../commons/enums";

class DjangoHealthCheckForm extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    label: PropTypes.string.isRequired,
    url: PropTypes.string,
    interval: PropTypes.number,
    isActive: PropTypes.bool,
    statusPageType: PropTypes.oneOf(Object.keys(STATUS_PAGE_TYPE)),
    emailNotifications: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      url: props.url ? props.url : "",
      interval: props.interval ? props.interval : 1000,
      isActive: props.isActive ? props.isActive : false,
      statusPageType: props.statusPageType ? props.statusPageType : "OFF",
      emailNotifications: props.emailNotifications ? props.emailNotifications : false,
      showDeleteModal: false
    };
  }

  render() {
    return (
      <Container className={styles.container}>
        {this.renderHealthCheckForm()}
        <br/>
        {this.renderHealthCheckInstruction()}
      </Container>
    );
  }

  renderHealthCheckForm = () => {
    return (
      <>
        <div className={styles.form__header}>
          <h4>{"Health check configuration"}</h4>
        </div>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label column={"url"}>{"Url: "}</Form.Label>
            <FormControl
              type="text"
              name="url"
              onChange={this.onChange}
              value={this.state.url}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column={"interval"}>
              {"Interval (in seconds):"}
            </Form.Label>
            <FormControl
              type="number"
              name="interval"
              onChange={this.onChange}
              value={this.state.interval}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column={"isActive"}>
              {"Is active:"}
            </Form.Label>
            <FormControl
              as="select"
              name="isActive"
              key={this.state.isActive}
              value={this.state.isActive ? "Enabled" : "Disabled"}
              onChange={this.onChangeBoolean}
            >
              <option key={false}>{"Disabled"}</option>
              <option key={true}>{"Enabled"}</option>
            </FormControl>
          </Form.Group>
          <Form.Group>
            <Form.Label column={"statusPageType"}>
              {"Display on status page:"}
            </Form.Label>
            <FormControl
              as="select"
              name="statusPageType"
              key={this.state.statusPageType}
              value={STATUS_PAGE_TYPE[this.state.statusPageType]}
              onChange={this.onChangeEnum}
            >
              {Object.entries(STATUS_PAGE_TYPE).map(entry => (
                <option key={entry[0]}>{entry[1]}</option>
              ))}
            </FormControl>
          </Form.Group>
          <Form.Group>
            <Form.Label column={"emailNotifications"}>
              {"Email notifications:"}
            </Form.Label>
            <FormControl
              as="select"
              name="emailNotifications"
              key={this.state.emailNotifications}
              value={this.state.emailNotifications ? "Enabled" : "Disabled"}
              onChange={this.onChangeBoolean}
            >
              <option key={false}>{"Disabled"}</option>
              <option key={true}>{"Enabled"}</option>
            </FormControl>
          </Form.Group>
          <ButtonToolbar className={styles.form__buttons}>
            <Button type="submit" variant="success">
              {this.props.label}
            </Button>
            {this.props.id && (
              <>
                <Button variant="primary" onClick={this.onDetailsClick}>
                  {"Details"}
                </Button>
                <Button variant="danger" onClick={this.onDeleteClick}>
                  {"Delete"}
                </Button>
              </>
            )}
          </ButtonToolbar>
          <DeleteModal
            label={"Delete this Django Health Check configuration"}
            show={this.state.showDeleteModal}
            onClose={() =>
              this.setState({...this.state, showDeleteModal: false})
            }
            onDelete={this.deleteDjangoHealthCheckConfiguration}
          />
        </Form>
      </>
    )
  };

  renderHealthCheckInstruction = () => {
    return (
      <div className={styles.instruction__container}>
        <div className={styles.form__header}>
          <h4>{"Health Check configuration - configuring service"}</h4>
        </div>

        <span className={styles.instruction__label}>
        {"Step 1: install the django-health-check package:"}
        </span>
        <span className={styles.instruction__code}>
          {"pip install django-health-check"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 2: Add the health checker to the URL you want to use"}
        </span>
        <span className={styles.instruction__code}>
          {"urlpatterns = [\n" +
          "    # ...\n" +
          "    url(r'^ht/', include('health_check.urls')),\n" +
          "]\n"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 3: Add the health_check applications to your INSTALLED_APPS:"}
        </span>
        <span className={styles.instruction__code}>
          {"INSTALLED_APPS = [\n" +
          "    # ...\n" +
          "    'health_check',\n" +
          "    'health_check.db',\n" +
          "    'health_check.cache',\n" +
          "    'health_check.storage'\n" +
          "]\n"}
        </span>

      </div>
    )
  };


  onChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  onChangeEnum = event => {
    this.setState({
      ...this.state,
      [event.target.name]: Object.keys(STATUS_PAGE_TYPE).find(
        key => STATUS_PAGE_TYPE[key] === event.target.value
      )
    });
  };

  onChangeBoolean = event => {
    this.setState({
      ...this.state,
      [event.target.name]: !this.state[event.target.name]
    });
  };

  onSubmit = event => {
    event.preventDefault();

    const configuration = {
      url: this.state.url,
      interval: this.state.interval,
      is_active: this.state.isActive,
      display_type: this.state.statusPageType,
      email_notifications: this.state.emailNotifications
    };
    this.props.onSubmit(configuration);
  };

  onDetailsClick = () => {
    this.props.changeView(view.DJANGO_HEALTH_CHECK_OVERVIEW);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteDjangoHealthCheckConfiguration = async () => {
    await this.props.deleteDjangoHealthCheck(
      this.props.serviceId,
      this.props.id
    );
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  serviceId: state.dashboard.selectedServiceId
});

export default connect(mapStateToProps, {
  changeView,
  deleteDjangoHealthCheck
})(DjangoHealthCheckForm);
