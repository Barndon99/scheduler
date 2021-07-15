import React from "react";
import "components/Button.scss";
import classNames from "classnames";


export default function Button(props) {
  const buttonClass = classNames(["button", { " button--danger": props.danger }, { " button--confirm": props.confirm }]);

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}