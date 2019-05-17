import React from "react";
import Cleave from "cleave.js/react";

const CleaveMod = props => {
  return (
    <div className="field">
      {props.label ? <label>{props.label}</label> : ""}
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
