import React from "react";
import EventItem from "./EventItem";

export default function EventList(props) {
  return (
    <ul className="list-group">
      {props.events.map((event) => (
        <EventItem key={event._id} title={event.title} userId= {props.auth}/>
      ))}
    </ul>
  );
}
