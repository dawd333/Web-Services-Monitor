import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {changeView, deleteSnmp} from "../../../../actions/dashboard";
import {view} from "../../DashboardModel";
import styles from "../common.less";
import {ButtonToolbar, Container} from "react-bootstrap";
import {DeleteModal} from "../../../common/delete-modal/DeleteModal";
import {STATUS_PAGE_TYPE} from "../../../../commons/enums";

class SnmpForm extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.number,
    ip: PropTypes.string,
    interval: PropTypes.number,
    isActive: PropTypes.bool,
    platform: PropTypes.string,
    username: PropTypes.string,
    statusPageType: PropTypes.oneOf(Object.keys(STATUS_PAGE_TYPE)),
    emailNotifications: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      ip: props.ip ? props.ip : "",
      interval: props.interval ? props.interval : 3600,
      isActive: props.isActive ? props.isActive : false,
      platform: props.platform ? props.platform : "Linux",
      username: props.username ? props.username : "",
      authenticationPassword: "",
      privacyPassword: "",
      statusPageType: props.statusPageType ? props.statusPageType : "OFF",
      emailNotifications: props.emailNotifications ? props.emailNotifications : false,
      showDeleteModal: false
    };
  }

  render() {
    return (
      <Container className={styles.container}>
        {this.renderSnmpForm()}
        <br/>
        {this.renderSnmpInstruction()}
      </Container>
    );
  }

  renderSnmpForm = () => {
    return (
      <>
        <div className={styles.form__header}>
          <h4>{"Snmp configuration"}</h4>
        </div>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label column={"ip"}>{"Ip"}</Form.Label>
            <FormControl
              type="text"
              name="ip"
              onChange={this.onChange}
              value={this.state.ip}
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
            <Form.Label column={"username"}>{"Username:"}</Form.Label>
            <FormControl
              type="text"
              name="username"
              onChange={this.onChange}
              value={this.state.username}
            />
            <Form.Label column={"authentication_password"}>
              {"Authentication Password:"}
            </Form.Label>
            <FormControl
              type="password"
              name="authenticationPassword"
              onChange={this.onChange}
              value={this.state.authenticationPassword}
            />
            <Form.Label column={"privacy_password"}>
              {"Privacy Password:"}
            </Form.Label>
            <FormControl
              type="password"
              name="privacyPassword"
              onChange={this.onChange}
              value={this.state.privacyPassword}
            />
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
            label={"Delete this snmp configuration"}
            show={this.state.showDeleteModal}
            onClose={() =>
              this.setState({...this.state, showDeleteModal: false})
            }
            onDelete={this.deleteSnmpConfiguration}
          />
        </Form>
      </>
    )
  };

  renderSnmpInstruction = () => {
    return (
      <div className={styles.instruction__container}>
        <div className={styles.form__header}>
          <h4>{"Snmp configuration - configuring agent"}</h4>
        </div>

        <span className={styles.instruction__label}>
        {"Step 1: Install libraries for SNMP protocol"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo apt-get update\n" +
          "sudo apt-get install snmp snmpd snmp-mibs-downloader libsnmp-dev"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 2: Edit snmp.conf - comment or remove line “mibs :” in the file"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo nano /etc/snmp/snmp.conf"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 3: Stop SNMP agent"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo service snmpd stop"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 4: Configure SNMP manager. Replace marked fields with your authentication password and privacy password"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo net-snmp-config --create-snmpv3-user -ro -x AES -a SHA -A \""}
          <span style={{color: 'red'}}>{"authPass"}</span>
          {"\" -X \""}
          <span style={{color: 'red'}}>{"privPass"}</span>
          {"\" username"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 5: Edit snmpd.conf file"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo nano /etc/snmp/snmpd.conf"}
        </span>
        <span className={styles.instruction__label}>
        {"Replace its content with text below. Provide your username in the marked field"}
        </span>
        <span className={styles.instruction__code}>
          {"agentAddress udp:161\n" +
          "rouser "}
          <span style={{color: 'red'}}>{"username"}</span>
          {" AuthPriv\n" +
          "disk / 100000\n" +
          "includeAllDisks 10%"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 6: Start SNMP agent"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo service snmpd start"}
        </span>

        <span className={styles.instruction__label}>
        {"Step 7: Check SNMP status"}
        </span>
        <span className={styles.instruction__code}>
          {"sudo service snmpd status"}
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
      ip: this.state.ip,
      interval: this.state.interval,
      is_active: this.state.isActive,
      platform: this.state.platform,
      username: this.state.username,
      authentication_password: this.state.authenticationPassword,
      privacy_password: this.state.privacyPassword,
      display_type: this.state.statusPageType,
      email_notifications: this.state.emailNotifications
    };
    this.props.onSubmit(configuration);
  };

  onDetailsClick = () => {
    this.props.changeView(view.SNMP_OVERVIEW);
  };

  onDeleteClick = () => {
    this.setState({
      ...this.state,
      showDeleteModal: true
    });
  };

  deleteSnmpConfiguration = async () => {
    await this.props.deleteSnmp(this.props.serviceId, this.props.id);
    this.props.changeView(view.OVERVIEW);
  };
}

const mapStateToProps = state => ({
  serviceId: state.dashboard.selectedServiceId
});

export default connect(mapStateToProps, {changeView, deleteSnmp})(SnmpForm);
