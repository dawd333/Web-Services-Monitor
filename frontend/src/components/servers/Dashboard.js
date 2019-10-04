import React, { Fragment } from "react";
import Form from "./Form";
import Servers from "./Servers";

export default function Dashboard() {
  return (
    <div>
      <Fragment>
        <Form />
        <Servers />
      </Fragment>
    </div>
  );
}
