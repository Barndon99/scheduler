import React from 'react'
import Button from 'components/Button'
import InterviewerList from 'components/InterviewerList'
import { useState } from "react";

export default function From(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const reset = () => {
    name = "";
    interviewer = null;
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  const save = () => {
    if (!name) {
      setError("Name is a mandatory field")
    }
    setError("")
    props.onSave(name, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={props.name}
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={event => {setName(event.target.value)}}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={event => cancel()}>Cancel</Button>
          <Button confirm onClick={event => save()}>Save</Button>
        </section>
      </section>
    </main>
  )
}