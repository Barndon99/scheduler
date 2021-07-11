import axios from "axios";
import { useState } from "react";

export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(item => item.name === day);

  if(!filteredDay || state.days.length === 0) return [];

  const mappedAppointments = filteredDay.appointments.map((appointmentId) => 
    state.appointments[appointmentId]
  );

  return mappedAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  
  const interviewerId = interview.interviewer;
  const arrayInterviewers = Object.keys(state.interviewers).map(key => state.interviewers[key]);

  const interviewer = arrayInterviewers.find(interviewer => interviewer.id === interviewerId);

  return {...interview, interviewer: interviewer}
}

export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.find(item => item.name === day);

  if(!filteredDay || state.days.length === 0) return [];

  const mappedInterviewers = filteredDay.interviewers.map(ele => 
    state.interviewers[ele]
  );

  return mappedInterviewers;
}
//We need to start by finding the object in our state.days array who's name matches the provided day. 
//With this information we can now access that specific days appointment array.

//Once we have access to the appointment array for the given day, we'll need to iterate through it, 
//comparing where it's id matches the id of states.appointments and return that value.

//We should also probably do a bit of validation. If there are no appointments on the given day, 
//our days data will be empty. According to our tests, in a case like this, we should return an empty array.