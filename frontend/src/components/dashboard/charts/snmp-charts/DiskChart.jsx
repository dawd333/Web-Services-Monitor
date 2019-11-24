import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Hint, RadialChart, DiscreteColorLegend } from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./SnmpCharts.less";
import { Col } from "react-bootstrap";
import { convertkBtoGB } from "../../../../commons/utils";

export class DiskChart extends Component {
  static propTypes = {
    lastResult: PropTypes.object
  };

  state = {
    diskHintValue: false
  };

  render() {
    const { diskHintValue } = this.state;

    return (
      <Fragment>
        <Col xs={4}>
          <RadialChart
            className={styles.snmpOverview__radialChart}
            innerRadius={100}
            radius={140}
            colorType="literal"
            getAngle={d => d.usage}
            data={this.translateResultForDisks(this.props.lastResult)}
            onValueMouseOver={value => this.setState({ diskHintValue: value })}
            onSeriesMouseOut={() => this.setState({ diskHintValue: false })}
            width={300}
            height={300}
            padAngle={0.04}
          >
            {diskHintValue !== false && <Hint value={diskHintValue} />}
          </RadialChart>
        </Col>
        <Col xs={2}>
          <DiscreteColorLegend
            height={200}
            width={300}
            items={this.diskChartLegendData()}
          />
        </Col>
      </Fragment>
    );
  }

  translateResultForDisks = result => {
    if (result) {
      const availableDiskSpace = {
        usage: convertkBtoGB(result.results[19]),
        color: "#42b883"
      };
      const usedDiskSpace = {
        usage: convertkBtoGB(result.results[20]),
        color: "#ff7e67"
      };

      return [availableDiskSpace, usedDiskSpace];
    } else return [{ usage: 1, stroke: "#", color: "#ffffff" }];
  };

  diskChartLegendData = () => {
    return [
      { title: "Available Disk space", color: "#42b883" },
      { title: "Used Disk space", color: "#ff7e67" }
    ];
  };
}
