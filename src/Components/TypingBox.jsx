import React, { useMemo, useRef, useState, createRef, useEffect } from "react";
import UpperMenu from "./UpperMenu";
import { useTestMode } from "../Context/TestMode";
import Stats from "./Stats";
import { Dialog, DialogTitle } from "@material-ui/core";

var randomwords = require("random-words");

export default function TypingBox() {
  const { testTime, testMode, testWords } = useTestMode();
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [countDown, setCountDown] = useState(() => {
    if (testMode === "words") {
      return 180;
    } else {
      return testTime;
    }
  });
  const [startTest, setStartTest] = useState(false);
  const [overTest, setOverTest] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [wordsArray, setWordsArray] = useState(() => {
    if (testMode === "words") {
      return randomwords(testWords);
    }
    return randomwords(100);
  });
  const [graphData, setGraphData] = useState([]);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const words = useMemo(() => {
    return wordsArray;
  }, [wordsArray]);
  const wordSpanRef = useMemo(() => {
    return Array(words.length)
      .fill(0)
      .map((i) => createRef(null));
  }, [words]);

  const resetWordSpanRefClassNames = () => {
    wordSpanRef.map((i) =>
      Array.from(i.current.childNodes).map((j) => (j.className = "char"))
    );
    wordSpanRef[0].current.childNodes[0].className = "char current";
  };

  const handleDialogEvents = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      redoTest();
      setOpenDialog(false);
      return;
    }
    if (e.keyCode === 13) {
      e.preventDefault();
      resetTest();
      setOpenDialog(false);
      return;
    }

    e.preventDefault();
    setOpenDialog(false);
    startTimer();
  };

  const redoTest = () => {
    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setStartTest(false);
    setOverTest(false);
    clearInterval(intervalId);
    setCountDown(testTime);
    if (testMode === "words") {
      setCountDown(180);
    }
    setGraphData([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCorrectWords(0);
    setMissedChars(0);
    setExtraChars(0);
    resetWordSpanRefClassNames();
  };

  const inputTextRef = useRef(null);

  const startTimer = () => {
    const intervalId = setInterval(timer, 1000);
    setIntervalId(intervalId);
    function timer() {
      setCountDown((countDown) => {
        setCorrectChars((correctChars) => {
          setGraphData((data) => {
            const startTime = testMode === "words" ? 180 : testTime;
            return [
              ...data,
              [
                startTime - countDown,
                Math.round(
                  correctChars / 5 / ((startTime - countDown + 1) / 60)
                ),
              ],
            ];
          });
          return correctChars;
        });

        if (countDown === 1) {
          clearInterval(intervalId);
          setCountDown(0);
          setOverTest(true);
        } else {
          return countDown - 1;
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 9) {
      if (startTest) {
        clearInterval(intervalId);
      }
      e.preventDefault();
      setOpenDialog(true);
      return;
    }
    if (!startTest) {
      startTimer();
      setStartTest(true);
    }
    let allChildrenSpans = wordSpanRef[currWordIndex].current.childNodes;

    // Logic of space
    if (e.keyCode === 32) {
      if (currWordIndex === wordsArray.length - 1) {
        clearInterval(intervalId);
        setOverTest(true);
        return;
      }

      const correctChar =
        wordSpanRef[currWordIndex].current.querySelectorAll(".correct");
      const incorrectChar =
        wordSpanRef[currWordIndex].current.querySelectorAll(".incorrect");
      setMissedChars(
        missedChars +
          (allChildrenSpans.length -
            (incorrectChar.length + correctChar.length))
      );

      if (correctChar.length === allChildrenSpans.length) {
        setCorrectWords(correctWords + 1);
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

      if (
        currWordIndex !== 0 &&
        wordSpanRef[currWordIndex + 1].current.offsetLeft <
          wordSpanRef[currWordIndex].current.offsetLeft
      ) {
        wordSpanRef[currWordIndex].current.scrollIntoView();
      }

      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(0);
      return;
    }

    // Logic of backspacing
    if (e.keyCode === 8) {
      if (currCharIndex !== 0) {
        if (currCharIndex === allChildrenSpans.length) {
          if (allChildrenSpans[currCharIndex - 1].className.includes("extra")) {
            allChildrenSpans[currCharIndex - 1].remove();
            allChildrenSpans[currCharIndex - 2].className += " right";
          } else {
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
      setExtraChars(extraChars + 1);
      return;
    }

    // Logic of correct & incorrect
    if (e.key === allChildrenSpans[currCharIndex].innerText) {
      allChildrenSpans[currCharIndex].className = "char correct";
      setCorrectChars(correctChars + 1);
    } else {
      allChildrenSpans[currCharIndex].className = "char incorrect";
      setIncorrectChars(incorrectChars + 1);
    }
    if (currCharIndex + 1 === allChildrenSpans.length) {
      allChildrenSpans[currCharIndex].className += " right";
    } else {
      allChildrenSpans[currCharIndex + 1].className = "char current";
    }

    setCurrCharIndex(currCharIndex + 1);
  };

  const calculateWPM = () => {
    return Math.round(
      correctChars / 5 / ((graphData[graphData.length - 1][0] + 1) / 60)
    );
  };
  const calculateAccuracy = () => {
    return Math.round((correctWords / currWordIndex) * 100);
  };

  const resetTest = () => {
    setCurrCharIndex(0);
    setCurrWordIndex(0);
    setStartTest(false);
    setOverTest(false);
    clearInterval(intervalId);
    setCountDown(testTime);
    if (testMode === "words") {
      let random = randomwords(testWords);
      setWordsArray(random);
      setCountDown(180);
    } else {
      let random = randomwords(100);
      setWordsArray(random);
    }
    setGraphData([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCorrectWords(0);
    setMissedChars(0);
    setExtraChars(0);
    resetWordSpanRefClassNames();
  };

  const focusInput = () => {
    inputTextRef.current.focus();
  };

  useEffect(() => {
    resetTest();
  }, [testTime, testMode, testWords]);

  useEffect(() => {
    focusInput();
    wordSpanRef[0].current.childNodes[0].className = "char current";
  }, []);

  return (
    <div>
      {overTest ? (
        <Stats
          wpm={calculateWPM()}
          accuracy={calculateAccuracy()}
          graphData={graphData}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          missedChars={missedChars}
          extraChars={extraChars}
          resetTest={resetTest}
        />
      ) : (
        <>
          <UpperMenu countDown={countDown} currWordIndex={currWordIndex} />
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
        </>
      )}

      <input
        type="text"
        className="hidden-input"
        ref={inputTextRef}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        open={openDialog}
        onKeyDown={handleDialogEvents}
        style={{
          backdropFilter: "blur(5px)",
        }}
      >
        <DialogTitle>
          <div className="instruction">Press space to redo</div>
          <div className="instruction">Press Tab/Enter to restart</div>
          <div className="instruction">Press any other key to exit</div>
        </DialogTitle>
      </Dialog>
    </div>
  );
}
