import React, { useState, useEffect } from "react";
import axios from "axios";


import "components/Application.scss";

import "components/DayList.js";
import DayList from "components/DayList.js";
import "components/Appointment";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "helpers/selectors";


//const appointments = [
//  {
//    id: 1,
//    time: "12pm",
//  },
//  {
//    id: 2,
//    time: "1pm",
//    interview: {
//      student: "Lydia Miller-Jones",
//      interviewer: {
//        id: 1,
//        name: "Sylvia Palmer",
//        avatar: "https://i.imgur.com/LpaY82x.png",
//      }
//    }
//  },
//  {
//    id: 3,
//    time: "4pm",
//    interview: {
//      student: "Bastian",
//      interviewer: {
//        id: 1,
//        name: "Sylvia Palmer",
//        avatar: "https://i.imgur.com/LpaY82x.png",
//      }
//    }
//  },
//  {
//    id: 4,
//    time: "2pm",
//    interview: {
//      student: "Greg Greggory",
//      interviewer: {
//        id: 1,
//        name: "Sylvia Palmer",
//        avatar: "https://i.imgur.com/LpaY82x.png",
//      }
//    }
//  },
//  {
//    id: 5,
//    time: "3Pm"
//  }
//];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: []
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({ ...state, day });

  //const setDays = (days) => {
  //  setState(prev => ({ ...prev, days }));
  //}

  useEffect(() => {
    //const getDaysUrl = '/api/days';
    //axios.get(getDaysUrl).then((response) => {setDays(response.data)})
    const days = '/api/days'
    const appointments = '/api/appointments'
    const interviewers = '/api/interviewers'
    Promise.all([
      axios.get(days),
      axios.get(appointments),
      axios.get(interviewers)
    ]).then((all) => {
      // set your states here with the correct values...
      //This is where the code broke, call a mentor tomorrow, there's a React error for that
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])
  
  const mappedAppointments = dailyAppointments.map(appointment => (
    <Appointment key={appointment.id} {...appointment} />)
  )

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
        {mappedAppointments}
      </section>
    </main>
  );
}

