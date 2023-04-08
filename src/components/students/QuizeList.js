import React, { useState } from "react";

export default function QuizeList({ quizDetails, qnumber, opChecked }) {
  const { option, isCorrect, id } = quizDetails || {};

  const [checkedValue, setCheckedValue] = useState(false);

  const handleCheck = (e) => {
    opChecked(e);
    setCheckedValue(!checkedValue);
  };

  return (
    <>
      <label htmlFor={`option${id}_q${qnumber}`}>
        <input
          type="checkbox"
          name={`option${id}_q${qnumber}`}
          id={`option${id}_q${qnumber}`}
          // value={checkedValue}
          onChange={() => handleCheck(isCorrect)}
        />{" "}
        {option}
      </label>
    </>
  );
}
