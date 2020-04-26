import React from "react";

export default function EventItem(props) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h1 className="text-info">{props.title}</h1>
        <p className="text-muted">
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </p>
      </div>

      <div>
        {props.userId === props.creatorId ? (
          <p className="mt-3">You are the owner of the event</p>
        ) : (
          <button className="btn btn-info">View Detail</button>
        )}
      </div>
    </li>
  );
}
