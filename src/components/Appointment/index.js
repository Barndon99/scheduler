import React from "react";

import "components/Appointment/styles.scss";

import Show from "components/Appointment/Show";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";

export default function Appointment(props) {
  
  
  return(
    <article className="appointment">
      <Header time="12PM" />
      {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />}
    </article>
  );
};