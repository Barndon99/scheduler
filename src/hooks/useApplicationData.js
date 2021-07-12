import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(intitial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: []
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      console.log("APP.JS INTERVIEWERS = ", interviewers);
      setState(prev => ({...prev, days, appointments, interviewers}))
    })
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //Decrease spots count by one *check with mentor*
    function decSpots() {
      console.log("Confirm Spots exist", state.days);
      const openDays = [...state.days];
      openDays.map((day) => {
        for (const appointment of day.appointments) {
          if (appointment === id) { day.spots = day.spots + 1};
        }
      });
      return openDays;
    }

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => 
        decSpots(),
        setState({
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
    //Incrase spots count by one *Check with mentor*
    function incSpots() {
      const openDays = [...state.days];
      openDays.map((day) => {
        for (const appointment of day.appointments) {
          if (appointment === id) {day.spots = day.spots + 1};
        }
      })
      return openDays;
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(() => 
      incSpots(),
      setState({
        ...state,
        appointments
      }));
  }

  return { state, setDay, bookInterview, cancelInterview};
}