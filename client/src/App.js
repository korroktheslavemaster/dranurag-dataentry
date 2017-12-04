import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from "react-router-dom";

import DrugsEntry from "./containers/DrugsEntry";
import TestsEntry from "./containers/TestsEntry";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Link to="/tests" className="btn btn-outline-primary px-2">
            Tests
          </Link>
          <Link to="/drugs" className="btn btn-outline-primary px-2">
            Drugs
          </Link>
          <Switch>
            <Route path="/tests" component={TestsEntry} />
            <Route path="/drugs" component={DrugsEntry} />
            {/* default is drugs*/}
            <Route component={DrugsEntry} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
