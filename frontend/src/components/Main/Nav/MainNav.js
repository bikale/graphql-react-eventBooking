import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const MainNav = (props) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <NavLink to="/" className="navbar-brand">
      Simple Event Booking
    </NavLink>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto ">
        <li className="nav-item">
          {props.token && (
            <NavLink to="/bookings" className="nav-link">
              Bookings
            </NavLink>
          )}
        </li>
        <li className="nav-item">
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
        </li>
      </ul>
      {!props.token && (
        <NavLink to="/auth" className="btn btn-primary my-2 my-sm-0">
          <i className="fa fa-user fa-2x"> </i>
          <span id="userLogin" className="badge badge-primary badge-light">
            Login{' '}
          </span>
        </NavLink>
      )}
      {props.token && (
        <button
          onClick={props.onLogOutEventHandler}
          className="btn btn-primary my-2 my-sm-0"
        >
          <i className="fa fa-user fa-2x"> </i>
          <span id="userLogin" className="badge badge-primary badge-light">
            logout{' '}
          </span>
        </button>
      )}
    </div>
  </nav>
);

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogOutEventHandler: () => dispatch({ type: 'logout' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
