import React, { useState, useEffect } from "react";
import axios from "axios";


import "components/Application.scss";

import "components/DayList.js";
import DayList from "components/DayList.js";
import "components/Appointment";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: [],
    interviewers: []
  });

  console.log("FORM.JS PROPS.INTERVIEWERS = ", props.interviewer);

  const setDay = day => setState({ ...state, day });

  //const setDays = (days) => {
  //  setState(prev => ({ ...prev, days }));
  //}

  useEffect(() => {
    //const getDaysUrl = '/api/days';
    //axios.get(getDaysUrl).then((response) => {setDays(response.data)})
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      // set your states here with the correct values...
      //This is where the code broke, call a mentor tomorrow, there's a React error for that
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      console.log("APP.JS INTERVIEWERS = ", interviewers);
      setState(prev => ({...prev, days, appointments, interviewers}))
    })
  }, [])

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  
  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(res => setState({
        ...state,
        appointments
      }));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(res => setState({
        ...state,
        appointments
      }))
  }


  console.log("APP.JS INTERVIEWERS = ", interviewers);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        id={appointment.id}
        key={`key_${appointment.id}`}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        /> 
      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>
  );
}

