import React from "react";
import { Popup, Button, Icon } from "semantic-ui-react";
import { STATUS_COLOR } from "../_helper/constant";

const QCButton = props => {
  const btn = props.button.filter(x => x.id > 1);
  return (
    <Popup
      trigger={
        <Button animated color="blue" disabled={props.disabled}>
          <Button.Content visible>Status QC</Button.Content>
          <Button.Content hidden>
            <Icon name="check circle" />
          </Button.Content>
        </Button>
      }
      content={
        <Button.Group>
          {btn.map(x => (
            <Button
              key={x.id}
              color={STATUS_COLOR[x.id]}
              content={x.name}
              onClick={() => props.onClick(x.id)}
            />
          ))}
        </Button.Group>
      }
      disabled={props.open || false}
      on="focus"
      hoverable
      position="top center"
    />
  );
};

export default QCButton;
