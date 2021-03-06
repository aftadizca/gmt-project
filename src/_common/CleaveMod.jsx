import React from "react";
import Cleave from "cleave.js/react";
import { Label } from "semantic-ui-react";

const CleaveMod = props => {
  return (
    <div className="field">
      {props.label ? (
        <Label content={props.label} pointing="below" color="blue" />
      ) : (
        ""
      )}
      <Cleave
        readOnly={props.readOnly}
        placeholder={props.placeholder}
        onChange={e =>
          props.onChange(e, {
            ...props,
            value: props.rawValue
              ? props.options.numeral
                ? parseInt(e.target.rawValue)
                : e.target.rawValue
              : e.target.value
          })
        }
        value={props.value}
        options={props.options}
      />
    </div>
  );
};

export default CleaveMod;
