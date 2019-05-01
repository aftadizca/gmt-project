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
              action="STATUS_QC"
              statusid={x.id}
              onClick={props.onClick}
            />
          ))}
        </Button.Group>
      }
      disabled={props.disabled}
      on="focus"
      //hoverable
      position="top center"
    />
  );
};

export default QCButton;
