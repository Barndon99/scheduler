import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode); 
    
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  }
  
  function back() {
    console.log("THIS IS THE BEGINNING: ", history)
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => [...prev.slice(0, prev.length - 1)]);
    };
    console.log("THIS IS THE END: ", history)
  }  

  return { mode, transition, back };
  
};

//this.setState(prevState => ({
//  myArray: [...prevState.myArray, "new value"]
//}))