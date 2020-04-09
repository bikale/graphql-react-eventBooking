import React, { Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';

import Auth from './components/Auth';
import Bookings from './components/Bookings';
import Events from './components/Events';
import MainNav from './components/Main/Nav/MainNav';

function App(props) {
  return (
    <BrowserRouter>
      <Fragment>
        <MainNav />
        <main>
          <Switch>
            {props.token && <Redirect from="/" to="/events" exact />}
            {props.token && <Redirect from="/auth" to="/events" exact />}
            {!props.token && <Route path="/auth" component={Auth} />}

            <Route path="/events" component={Events} />
            {props.token && <Route path="/bookings" component={Bookings} />}
            {!props.token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};
export default connect(mapStateToProps)(App);
