import React from "react";
import { Popup, Button } from "semantic-ui-react";
import { STATUS_COLOR } from "../_helper/constant";

const StatusButton = props => {
  const btn = props.button.filter(
    x => x.name.toLowerCase() !== props.label.toLowerCase() && x.id > 1
  );
  return (
    <Popup
      trigger={
        <Button
          color={STATUS_COLOR[props.label.toLowerCase()]}
          content={props.label}
        />
      }
      content={
        <Button.Group>
          {btn.map(x => (
            <Button
              key={x.name}
              color={STATUS_COLOR[x.name.toLowerCase()]}
              content={x.name}
              onClick={() => props.onClick(x.id)}
            />
          ))}
        </Button.Group>
      }
      disabled={props.disabled || false}
      on="focus"
      hoverable
      position="top right"
    />
  );
};

export default StatusButton;
