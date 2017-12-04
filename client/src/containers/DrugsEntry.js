import React, { Component } from "react";

import GenericEntry from "../components/GenericEntry";

export default () => (
  <GenericEntry
    acEndpoint="/autocomplete/onemgDrugs"
    saveEndpoint="/addDrugs"
    inputCallbackNames={["frequency", "specialComments", "duration", "dosage"]}
    displayKeys={{
      primaryDisplayKey: "name",
      secondaryDisplayKeys: ["manufacturer"]
    }}
  />
);
