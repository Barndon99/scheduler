import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

import Show from "components/Appointment/Show";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  //Add a new interview
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  }

  function deleteAppointment(id) {
    transition(DELETING, true)

    props.cancelInterview(id).then(() => transition(EMPTY));
  }

  //Temporary value
  const interviewers = [];

  return (
    <article className="appointment">
      <Header time="12PM" />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onCancel={() => deleteAppointment(props.id)}
          onSave={(name, interviewer) => save(name, interviewer)}
        />}
      {mode === SHOW && (
        <Show
          interview={props.interview}
          interviewer={props.interview.interviewer}
          id={props.id}
          onDelete={deleteAppointment}
        />
      )}
      {mode === SAVING && (
        <Status 
        message="Saving..."
        />
      )}
      {mode === DELETING && (
        <Status
        message="Deleting..."
        />
      )}
    </article>
  );
};