import React, { Fragment } from "react";
import ServerForm from "./ServerForm";
import Servers from "./Servers";

export default function ServerDashboard() {
  return (
    <div>
      <Fragment>
        <ServerForm />
        <Servers />
      </Fragment>
    </div>
  );
}
