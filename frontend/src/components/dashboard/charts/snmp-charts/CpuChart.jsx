import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Hint, RadialChart, DiscreteColorLegend } from "react-vis";
import "../../../../../../node_modules/react-vis/dist/style.css"; // import react-vis stylesheet
import styles from "./SnmpCharts.less";
import { Col } from "react-bootstrap";

export class CpuChart extends Component {
  static propTypes = {
    results: PropTypes.array
  };

  state = {
    cpuHintValue: false
  };

  render() {
    const { cpuHintValue } = this.state;

    return (
      <Fragment>
        <Col xs={4}>
          <RadialChart
            className={styles.snmpCharts_radialChart}
            innerRadius={100}
            radius={140}
            colorType="literal"
            getAngle={d => d.usageInPercent}
            data={this.translateResultsForCPU(this.props.results)}
            onValueMouseOver={value => this.setState({ cpuHintValue: value })}
            onSeriesMouseOut={() => this.setState({ cpuHintValue: false })}
            width={300}
            height={300}
            padAngle={0.04}
          >
            {cpuHintValue !== false && <Hint value={cpuHintValue} />}
          </RadialChart>
        </Col>
        <Col xs={2}>
          <DiscreteColorLegend
            height={200}
            width={300}
            items={this.cpuChartLegendData()}
          />
        </Col>
      </Fragment>
    );
  }

  translateResultsForCPU = results => {
    let userCPU = { usageInPercent: 0, color: "#FF9833" };
    let systemCPU = { usageInPercent: 0, color: "#79C7E3" };
    let idleCPU = { usageInPercent: 0, color: "#1A3177" };

    if (results) {
      if (results.length === 0)
        return [{ usageInPercent: 1, stroke: "#", color: "#ffffff" }];
      let errors = 0;
      results.forEach(result => {
        if (result.error_messages.length === 0) {
          userCPU.usageInPercent += parseInt(result.results[7]);
          systemCPU.usageInPercent += parseInt(result.results[8]);
          idleCPU.usageInPercent += parseInt(result.results[9]);
        } else {
          errors += 1;
        }
      });
      const resultsLength = results.length - errors;
      userCPU.usageInPercent /= resultsLength;
      systemCPU.usageInPercent /= resultsLength;
      idleCPU.usageInPercent /= resultsLength;
      return [userCPU, systemCPU, idleCPU];
    } else {
      return [{ usageInPercent: 1, stroke: "#", color: "#ffffff" }];
    }
  };

  cpuChartLegendData = () => {
    return [
      { title: "User CPU%", color: "#FF9833" },
      { title: "System CPU%", color: "#79C7E3" },
      { title: "Idle CPU%", color: "#1A3177" }
    ];
  };
}
