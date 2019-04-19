import React from "react";
import { Label } from "semantic-ui-react";

const LabelTab = props => {
  return props.count > 0 ? <Label pointing="left">{props.count}</Label> : "";
};

export default LabelTab;
