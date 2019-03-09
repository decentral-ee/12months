import React, {useState} from 'react';
import {Dropdown} from './ui/dropdown';
import './GetLoan.css';

export default function GetLoan() {
  const [vin, setVin] = useState();
  const [year, setYear] = useState();
  const [model, setModel] = useState({
    items: [{code: 'VolvoXC90', label: 'Volvo XC90'}],
    isOpen: false,
    selected: null
  });
  function handleModelClick() {
    setModel({...model, isOpen: !model.isOpen});
  }
  function handleModelSelect(event, item) {
    setModel({...model, selected: item, isOpen: false});
  }

  function handleSubmit() {

  }

  return (
    <div className="loan">
      <div className="header"></div>
      <div className="body">
        <div className="form">
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-2 col-form-label"></label>
            <div className="col-sm-5">
              <div className="photo">
                Upload Photo
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-2 col-form-label">VIN</label>
            <div className="col-sm-5">
              <input
                id="vin"
                type="text"
                className="form-control"
                value={vin}
                onChange={event => setVin(event.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="model" className="col-sm-2 col-form-label">Model</label>
            <div className="col-sm-3">
              <Dropdown
                label='Select'
                items={model.items}
                selected={model.selected}
                isOpen={model.isOpen}
                onClick={handleModelClick}
                onSelect={handleModelSelect}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-2 col-form-label">Year</label>
            <div className="col-sm-5">
              <input
                id="year"
                type="text"
                className="form-control"
                value={year}
                onChange={event => setYear(event.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-2 col-form-label"></label>
            <div className="col-sm-5">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
