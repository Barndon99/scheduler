import React from "react";
import DayListItem from "components/DayListItem"

export default function DayList (props) {
  const mappedDays = props.days.map((day) => {
    return <DayListItem
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      onClick={props.setDay}
      key={day.id}
    />;
  })

  return (
  <ul>{mappedDays}</ul>
  )
}