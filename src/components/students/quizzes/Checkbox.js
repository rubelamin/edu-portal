import React from "react";

export default function Checkbox({ className, text, htmlFor, ...rest }) {
  return (
    <label className={className} htmlFor={htmlFor}>
      <input type="checkbox" {...rest} />
      {text}
    </label>
  );
}
