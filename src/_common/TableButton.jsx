import React from "react";
import { Button, Icon } from "semantic-ui-react";

const TableButton = props => {
  return (
    <Button animated size="mini" color={props.color} onClick={props.onClick}>
      <Button.Content hidden>{props.title}</Button.Content>
      <Button.Content visible>
        <Icon name={props.icon} />
      </Button.Content>
    </Button>
  );
};

export default TableButton;
