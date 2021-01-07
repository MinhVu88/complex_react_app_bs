import React from "react";

// react makes any nested JSX content available from within props.children
function Container(props) {
  return (
    <div
      className={`container py-md-5 ${props.wide ? "" : "container--narrow"}`}
    >
      {props.children}
    </div>
  );
}

export default Container;
