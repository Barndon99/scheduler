import { tSExternalModuleReference } from "@babel/types";
import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setHistory(prev => [...prev, newMode]);
      setMode(newMode); 
    }
    //ASK A MENTOR ABOUT THIS NEXT TIME YOU REVISIT, THIS WORKS TENATIVELY DUE TO... BEES?
    const updatedHistory = [...history]
    setHistory(prev => [...updatedHistory, newMode]);
    setMode(newMode);
  }
  
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => [prev.slice(0, prev.length - 1)]);
    };
  }
  

  return { mode, transition, back };
  
};

//this.setState(prevState => ({
//  myArray: [...prevState.myArray, "new value"]
//}))