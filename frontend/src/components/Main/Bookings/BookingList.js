import React from "react";

export default function BookingList(props) {
  return (
    <ul className="list-group">
      {props.bookings.map((booking) => (
        <li
          key={booking._id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <h1 className="text-info">{booking.event.title}</h1>
            <p className="text-muted">
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <button
              className="btn btn-danger"
              onClick={props.onDelete.bind(this, booking._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
