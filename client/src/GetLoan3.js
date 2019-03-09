import React, {useState, useContext} from 'react';
import {sign} from './id-card';
import * as Web3Utils from 'web3-utils';
import { FaFilePdf } from 'react-icons/fa';

import {ApiContext} from './context';

export default function GetLoan3(props) {
  const {location} = props;
  const {pdf, pdfBytes, vin, model, year, idNumber, ask, interest, term} = location.state;
  const [signature, setSignature] = useState();
  const [downloaded, setDownloaded] = useState(false);
  const apiURI = useContext(ApiContext);

  async function handleSign() {
    const pdfHex = uint8ArrayToHex(pdfBytes);
    const pdfHash = Web3Utils.sha3(`0x${pdfHex}`).slice(2);

    console.log(`PDF! Hash: ${pdfHash}, hex: `, pdfHex);

    //  const docHash = '413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2';
    try {
      const signature = await sign(pdfHash);
      // const signature = { hex: 'asdasdasdasdasdasdsad' };
      console.log(`Signature! `, signature);
      setSignature(signature.hex);

      // send files to the server
      console.log(`Api! `, apiURI);
      await fetch(`${apiURI}/api/deals`, {
        // credentials: 'include',
        method: 'POST',
        body: JSON.stringify({
          files: [{
            content: pdfHex,
            name: 'contract.pdf.hex'
          }, {
            content: signature.hex,
            name: 'contract.signature.hex'
          }]
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        console.log(`Sent to the server!`, response.json());
        return response.json();
      }).catch(error => {
        console.log(`Error while sending files!`, error);
      });
    } catch (event) {
      console.log(`Signing failed!`, event);
    }
  }

  return (
    <div>
      <div className="card-title">Please Confirm:</div>
      <div className="form card mx-auto">
        <div className="p-4 getLoan3">
          <div className=" row no-gutters">
            <label htmlFor="vin" className="col-sm-4 col-form-label">VIN</label>
            <div className="col-sm-8 px-2">{vin}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="model" className="col-sm-4 col-form-label">Model</label>
            <div className="col-sm-8 px-2">{model}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="year" className="col-sm-4 col-form-label">Year</label>
            <div className="col-sm-8 px-2">{year}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="ask" className="col-sm-4 col-form-label">ID Number</label>
            <div className="col-sm-8 px-2">{idNumber}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="ask" className="col-sm-4 col-form-label">Loan</label>
            <div className="col-sm-8 px-2">{ask}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="interest" className="col-sm-4 col-form-label">Interest</label>
            <div className="col-sm-8 px-2">{interest}</div>
          </div>
          <div className=" row no-gutters">
            <label htmlFor="term" className="col-sm-4 col-form-label">Term</label>
            <div className="col-sm-8 px-2">{term}</div>
          </div>
          <div className="mt-3">
            <a href={pdf} onClick={event => setDownloaded(true)} className="btn btn-primary float-right" download="contract.pdf"><FaFilePdf /> Download contract</a>
            <div className="row no-gutters">
              <label htmlFor="" className="col-sm-4 col-form-label"></label>
              <button type="button" disabled={!downloaded} className="btn btn-primary" onClick={handleSign}>Sign</button>
            </div>
          </div>
          <div className="form-group row">
            {signature}
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
