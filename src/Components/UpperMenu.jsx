import React from "react";
import { useTestMode } from "../Context/TestMode";

const UpperMenu = ({countDown, currWordIndex}) => {

    const {setTestTime, testMode, setTestWords, setTestMode, testWords} = useTestMode();

    const updateTime = (e) => {
        setTestTime(e.target.id)
    }
    const updateWords = (e) => {
      setTestWords(Number(e.target.id));
    }
    const setMode = (e) => {
      setTestMode(e.target.id);
    }


  return (
    <div className="upper-menu">
      <div className="counter">
        {(testMode === 'words') ? `${currWordIndex}/${testWords}` : countDown}
      </div>
      <div className="modes">
      <span className="mode" id="time" onClick={(e) => setMode(e)} style={{padding:'10px'}}>Time</span>
      <span className="mode" id="words" onClick={(e) => setMode(e)}>Words</span>
      </div>
      {(testMode === 'time')?(
        <div className="time-modes">
        <div className="time" id={15} onClick={(e) => updateTime(e)} >15s</div>
        <div className="time" id={30} onClick={(e) => updateTime(e)} >30s</div>
        <div className="time" id={45} onClick={(e) => updateTime(e)} >45s</div>
      </div>
      ):(
        <div className="word-mode">
        <div className="no-of-words" id={10} onClick={(e) => updateWords(e)}>10</div>
        <div className="no-of-words" id={30} onClick={(e) => updateWords(e)}>30</div>
        <div className="no-of-words" id={45} onClick={(e) => updateWords(e)}>45</div>
        </div>
      )}
    </div>
  );
};

export default UpperMenu;
