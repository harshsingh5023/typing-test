import React, { useMemo, useRef, useState, createRef, useEffect } from "react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestMode";
import Stats from "./Stats";

var randomwords = require('random-words');

export default function TypingBox() {
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [countDown, setCountDown] = useState(15);
  const [startTest, setStartTest] = useState(false);
  const [overTest, setOverTest] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0); 
  const [wordsArray, setWordsArray] = useState(() => {return randomwords(100)});

  const words = useMemo(() => {
    return wordsArray;
  }, [wordsArray]);
  const wordSpanRef = useMemo(() => {
    return Array(words.length).fill(0).map((i) => createRef(null));
  }, [words]);

  const resetWordSpanRefClassNames = () => {
    wordSpanRef.map(i => (
      Array.from(i.current.childNodes).map(j => (
         j.className = 'char'
      ))
    ));
    wordSpanRef[0].current.childNodes[0].className = "char current";
  }

  
  const {testTime} = useTestMode();

  const inputTextRef = useRef(null);


    const startTimer = () => {
        const intervalId = setInterval(timer, 1000);
        setIntervalId(intervalId);
        function timer(){
            setCountDown(countDown => {
                if(countDown===1){
                    clearInterval(intervalId);
                    setCountDown(0);
                    setOverTest(true);
                }else{
                    return countDown-1;
                }
            });
        }
    }



  const handleKeyDown = (e) => {
    if(!startTest){
        startTimer();
        setStartTest(true);
    }
    let allChildrenSpans = wordSpanRef[currWordIndex].current.childNodes;

    // Logic of space
    if (e.keyCode === 32) {
      const correctChar = wordSpanRef[currWordIndex].current.querySelectorAll('.correct');
      if(correctChar.length === allChildrenSpans.length){
        setCorrectWords(correctWords+1);
      }

      //removing cursor from the word
      if (allChildrenSpans.length <= currCharIndex) {
        allChildrenSpans[currCharIndex - 1].className = allChildrenSpans[
          currCharIndex - 1
        ].className.replace("right", "");
      } else {
        allChildrenSpans[currCharIndex].className = allChildrenSpans[
          currCharIndex
        ].className.replace("current", "");
      }

      // add cursor to new word
      wordSpanRef[currWordIndex + 1].current.childNodes[0].className =
        "char current";

      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(0);
      return;
    }

    // Logic of backspacing
    if (e.keyCode === 8) {
      if (currCharIndex !== 0) {
        if (currCharIndex === allChildrenSpans.length) {

            if(allChildrenSpans[currCharIndex-1].className.includes('extra')){
                allChildrenSpans[currCharIndex-1].remove();
                allChildrenSpans[currCharIndex-2].className += ' right';
            }else{
                allChildrenSpans[currCharIndex - 1].className = "char current";
            }

          setCurrCharIndex(currCharIndex - 1);
          return;
        }
        allChildrenSpans[currCharIndex].className = "char";
        allChildrenSpans[currCharIndex - 1].className = "char current";
        setCurrCharIndex(currCharIndex - 1);
      }

      return;
    }

    if (currCharIndex === allChildrenSpans.length) {
      let newSpan = document.createElement("span");
      newSpan.innerText = e.key;
      newSpan.className = "char incorrect right extra";
      allChildrenSpans[currCharIndex - 1].className = allChildrenSpans[
        currCharIndex - 1
      ].className.replace("right", "");

      wordSpanRef[currWordIndex].current.append(newSpan);
      setCurrCharIndex(currCharIndex + 1);
      return;
    }

    // Logic of correct & incorrect
    if (e.key === allChildrenSpans[currCharIndex].innerText) {
      allChildrenSpans[currCharIndex].className = "char correct";
      setCorrectChars(correctChars+1);
    } else {
      allChildrenSpans[currCharIndex].className = "char incorrect";
    }
    if (currCharIndex + 1 === allChildrenSpans.length) {
      allChildrenSpans[currCharIndex].className += " right";
    } else {
      allChildrenSpans[currCharIndex + 1].className = "char current";
    }

    setCurrCharIndex(currCharIndex + 1);
  };

  const calculateWPM = () => {
    return Math.round((correctChars/5)/(testTime/60));
  }
  const calculateAccuracy = () => {
    return Math.round((correctWords/currWordIndex)*100);
  }

  const resetTest = () => {
    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setStartTest(false);
    setOverTest(false);
    clearInterval(intervalId);
    setCountDown(testTime);
    let random = randomwords(100);
    setWordsArray(random);
    resetWordSpanRefClassNames();
  }

  const focusInput = () => {
    inputTextRef.current.focus();
  };

  useEffect(() => {
    resetTest();
  }, [testTime])

  useEffect(() => {
    focusInput();
    wordSpanRef[0].current.childNodes[0].className = "char current";
  }, []);

  return (
    <div>
    <UpperMenu countDown={countDown} />
    {overTest?<Stats wpm={calculateWPM()} accuracy={calculateAccuracy()} />: (
      <div className="type-box" onClick={focusInput}>
        <div className="words">
          {/* span of words */}
          {words.map((word, index) => (
            <span className="word" ref={wordSpanRef[index]} key={index}>
              {word.split("").map((char, idx) => (
                <span className="char" key={idx}>
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    )}

      <input
        type="text"
        className="hidden-input"
        ref={inputTextRef}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </div>
  );
}
