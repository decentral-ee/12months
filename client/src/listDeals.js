import React, {useState, useRef, useContext} from 'react';
import {Dropdown} from './ui/dropdown';
import {HistoryContext} from './context';
import Image from './images/image.svg';
import { FaUpload } from 'react-icons/fa';

export default function GetLoan1() {
  const history = useContext(HistoryContext);

  function handleNext() {
    const data = {
    };
    // next page
    history.push({
      pathname: '/deal/',
      state: {
        ...data
      }
    });
  }
  const Tbody=()=>{
    const values = [];
    const html = '';
    values.forEach(v => {
      let row =
        "<tr className='row'><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td><td>"
        +
        +"</td></tr>";
      html.push(row);
    });
    return html;
  }
  return (
    <>
      <div className="body">
        <div className="card-title">List Deals:</div>
        <table class="table table-striped">
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
          {Tbody()}
        </table>
      </div>
    </>
  )
}

export function fileListToFilesArray(files) {
  if (!files) { return null; }
  const result = [];
  for (let i = 0; i < files.length; i++) {
    result.push(files[i]);
  }
  return result;
}
