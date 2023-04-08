import React from "react";
import Checkbox from "./Checkbox";

export default function Answers({
  options = [],
  handleChange,
  questionNumber,
}) {
  return (
    <div className="quizOptions">
      {options.map((option, index) => (
        <Checkbox
          htmlFor={`option${option.id}_q${questionNumber + 1}`}
          name={`option${option.id}_q${questionNumber + 1}`}
          id={`option${option.id}_q${questionNumber + 1}`}
          text={option.option}
          value={index}
          checked={option.checked}
          onChange={(e) => handleChange(e, index)}
          key={`q${questionNumber + 1}-op${option.id}`}
        />
      ))}
    </div>
  );
}
