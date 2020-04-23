import React from "react";

export default function EventItem(props) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {props.title}
    </li>
  );
}
