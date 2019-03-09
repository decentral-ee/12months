import React from 'react';
import {sign} from './id-card';
import * as Web3Utils from 'web3-utils';

export default function GetLoan3(props) {
  const {location} = props;
  const {pdf, pdfBytes, vin, model, year, ask, interest, term} = location.state;

  function handleSign() {
    const pdfHex = uint8ArrayToHex(pdfBytes);
    const pdfHash = Web3Utils.sha3(`0x${pdfHex}`).slice(2);

    console.log(`PDF! Hash: ${pdfHash}, hex: `, pdfHex);

    //  const docHash = '413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2';
    try {
      sign(pdfHash);
    } catch (event) {
      console.log(`Signing failed!`, event);
    }
  }

  return (
    <div>
      <a href={pdf} download="contract.pdf">Download contract pdf</a>
      <div className="form card mx-auto">
        <div className="px-4">
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-4 col-form-label">VIN</label>
            <div className="col-sm-8">{vin}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="model" className="col-sm-4 col-form-label">Model</label>
            <div className="col-sm-8">{model}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="year" className="col-sm-4 col-form-label">Year</label>
            <div className="col-sm-8">{year}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="ask" className="col-sm-4 col-form-label">Ask</label>
            <div className="col-sm-8">{ask}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="interest" className="col-sm-4 col-form-label">Interest</label>
            <div className="col-sm-8">{interest}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="term" className="col-sm-4 col-form-label">Term</label>
            <div className="col-sm-8">{term}</div>
          </div>
          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label"></label>
            <div className="col-sm-8">
              <button type="button" className="btn btn-primary" onClick={handleSign}>Sign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function uint8ArrayToHex(uint8Arr) {
  let result = "";
  for (let i = 0; i < uint8Arr.byteLength; i++) {
    result += uint8Arr[i].toString(16);
  }
  return result;
}
