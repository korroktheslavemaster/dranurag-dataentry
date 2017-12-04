import React, { Component } from "react";

import GenericEntry from "../components/GenericEntry";

export default () => (
  <GenericEntry
    acEndpoint="/autocomplete/onemgTests"
    saveEndpoint="/addTests"
    inputCallbackNames={[]}
    displayKeys={{
      primaryDisplayKey: "name",
      secondaryDisplayKeys: ["sub_name", "abbreviation"]
    }}
  />
);
