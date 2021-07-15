import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classNames(["day-list__item", { " day-list__item--selected": props.selected }, { " day-list__item--full": (props.spots === 0) }])
  let daysLeft = "";

  if (props.spots === 0) {
    daysLeft = "no spots remaining";
  } else if (props.spots === 1) {
    daysLeft = "1 spot remaining";
  } else {
    daysLeft = `${props.spots} spots remaining`;
  }

  return (
    <li onClick={() => props.onClick(props.name)} className={dayClass} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{daysLeft}</h3>
    </li>
  );
}

