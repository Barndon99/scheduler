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
  //Get spots for the day
  function getSpotsForDay(dayObj, appointments) {
    let spots = 0;

    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    console.log("SPOTS IN GET SPOTS: ", spots);
    return spots;
  };
  //Change spots function 
  function updateSpots(days, dayName, appointments) {
    const dayObj = days.find(item => item.name === dayName);
    
    const spots = getSpotsForDay(dayObj, appointments);
    const newDay = {...dayObj, spots};
    console.log("SPOTS IN UPDATE SPOTS: ", spots)
    
    const newDays = days.map(item => (item.name === dayName) ? newDay : item);

    return newDays;
  };

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

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => { 
        setState({
        ...state,
        appointments, days: updateSpots(state.days, state.day, appointments)
      });
    });
  };

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
      .then(() => { 

        setState({
        ...state,
        appointments, days: updateSpots(state.days, state.day, appointments)
      });
    });
  };

  return { state, setDay, bookInterview, cancelInterview};
}