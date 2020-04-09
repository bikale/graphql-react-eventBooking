import React, { Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import Auth from './components/Auth';
import Bookings from './components/Bookings';
import Events from './components/Events';
import MainNav from './components/Main/Nav/MainNav';

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <MainNav />
        <main>
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
