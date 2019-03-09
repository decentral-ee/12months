import React from 'react';
import {Route} from 'react-router-dom';
import ListDeals from './listDeals';

export default function GetInterest() {
  return (
    <div className="interest">
    <Route exact path="/deals" component={ListDeals} />
  {/*
    <Route exact path="/interest/2" component={GetInterest2} />
    <Route exact path="/interest/3" component={GetInterest3} />
    */}

    </div>
  );
}
