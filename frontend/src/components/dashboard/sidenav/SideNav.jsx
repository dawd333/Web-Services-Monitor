import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Accordion, AccordionCollapse, AccordionToggle, Card} from "react-bootstrap";
import styles from "./SideNav.less"
import {Service} from "../../../actions/types";


export class SideNav extends React.Component {
  static propTypes = {
    services: PropTypes.arrayOf(PropTypes.shape(Service)),
  };


  render() {
    return (
      <nav className={styles.sideNav}>
        {renderNavItems(this.props.services)}
      </nav>
    )
  }
}

const renderNavItems = (services) => {
  return (
    <Accordion defaultActiveKey={services?.[0].id}>
      {
        services.map(service => {
          return (
            <Card key={service.id}>
              <AccordionToggle as={Card.Header} eventKey={service.id} className={styles.toggle}>
                {service.name}
              </AccordionToggle>
              <AccordionCollapse eventKey={service.id}>
                <Card.Body>
                  <ul>
                    <li>{"TODO"}</li>
                    <li>{"Menu"}</li>
                    <li>{"for"}</li>
                    <li>{"Service"}</li>
                  </ul>
                </Card.Body>
              </AccordionCollapse>
            </Card>
          )
        })
      }
    </Accordion>
  )
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(SideNav);
