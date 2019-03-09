import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Landing from './Landing';
import GetLoan from './GetLoan';
import './App.css';

const history = createBrowserHistory();

function App () {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/loan" component={GetLoan} />
      </Switch>
    </Router>
  );
}
export default App;
