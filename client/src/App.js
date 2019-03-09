import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import createBrowserHistory from "history/createBrowserHistory";
import Landing from './Landing';
import GetLoan from './GetLoan';

// include all the css-es
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const history = createBrowserHistory();

function App () {
  return (
    <>
    <div className="header p-2 w-100">
      <h1 className="logo text-left mt-0">12months</h1>
    </div>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/loan" component={GetLoan} />
      </Switch>
    </Router>

    </>
  );
}
export default App;
