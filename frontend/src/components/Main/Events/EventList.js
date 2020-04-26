import React from "react";
import EventItem from "./EventItem";

export default function EventList(props) {
  return (
    <ul className="list-group">
      {props.events.map((event) => (
        <EventItem
          key={event._id}
          title={event.title}
          price={event.price}
          date={event.date}
          userId={props.authUserId}
          creatorId={event.creator._id}
        />
      ))}
    </ul>
  );
}
