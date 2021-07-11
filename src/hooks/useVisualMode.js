import { tSExternalModuleReference } from "@babel/types";
import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if (replace) {
      setHistory(history.slice(0, history.length -1));
    }
    setHistory(prev => [...prev, newMode]); 
  }
  
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(history.slice(0, history.length - 1));
    };
  }
  

  return { mode, transition, back };
  
};

//this.setState(prevState => ({
//  myArray: [...prevState.myArray, "new value"]
//}))