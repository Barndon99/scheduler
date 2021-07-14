import React from "react";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

import Show from "components/Appointment/Show";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

//TALK TO A MENTOR ABOUT WEIRD DELETING BEHAVIOR AROUND CONFIRM ELEMENT (POSSIBLY FIXED WITH CALLBACK)

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  //Add a new interview
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {
        transition(ERROR_SAVE, true);
    });
  }

  function deleteAppointment() {
    transition(DELETING, true)

    Promise.resolve(props.cancelInterview(props.id))
      .then(() => transition(EMPTY))
      .catch(error => {
        transition(ERROR_DELETE, true);
    });
  }

  //Temporary value
  const interviewers = [];

  return (
    <article className="appointment" data-testid="appointment">
      <Header time="12PM" />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE &&
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={(name, interviewer) => save(name, interviewer)}
        />}
      {mode === SHOW && (
        <Show
          interview={props.interview}
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          id={props.id}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving..."
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onConfirm={deleteAppointment}
          onCancel={() => back()}
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting..."
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interview={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Couldn't Save please try again"
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Couldn't Delete please try again"
          onClose={() => back()}
        />
      )}
    </article>
  );
};