import React, {useState, useContext} from 'react';
import {HistoryContext} from './context';

export default function ListDeals() {
  const history = useContext(HistoryContext);

  function finance(deal){
    const path = "/deal/" + deal.id;
    history.push({
      pathname: path,
      state: {
        ...deal
      }
    });
  }

  const Tbody=()=>{
    const values = [];
    const test = {
     vin : 'CR1PT0T0TH3M00N',
     year :"2017",
     model : "Rekt Lambo",
     ask : "1000",
     interest : "10",
     term : "12",
     id :"2222"
    };
    const test2 = test;
    values.push(test);
    values.push(test2);
    var html = [];
    values.forEach(v => {
      let row =
        <tr className=''>
          <th  scope="row">
            {v.model}
          </th>
          <td>
            {v.year}
          </td>
          <td>
            {v.vin}
          </td>
          <td>
            {v.ask}
          </td>
          <td>
            {v.interest}
          </td>
          <td>
            {v.term}
          </td>
          <td>
            <button
              id={v.id}
              className='finance'
              onClick={(e)=>finance(v)} >
              Finance!
            </button>
          </td>
        </tr>;
      html.push(row);
    });
    return html;
  }
  return (
    <>
      <div className="body">
        <div className="card-title">List Deals:</div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Car Name</th>
              <th>Year</th>
              <th>VIN#</th>
              <th>Loan</th>
              <th>Interest</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {Tbody()}
          </tbody>
        </table>
      </div>
    </>
  )
}
