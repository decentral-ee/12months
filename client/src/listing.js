import React, {useState, useRef, useContext} from 'react';
import {HistoryContext} from './context';
import Image from './images/image2.svg';
import {FaFilePdf} from 'react-icons/fa';

export default function Listing(props) {
  const {location} = props;
  const {vin, model, year, dealId, ask, term, interest, success} = location.state;
  const history = useContext(HistoryContext);
  const [photo, setPhoto] = useState(Image);
  const [contract, setContract] = useState();
  const [deposited, setDeposited] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function handleSign(){

  }
  function handleDeposit(){
    setDeposited(true);
    // metamask deposit ask DAI
  }
  return (
    <>
      <div className="body">
        <div className="card-title">Car Details:</div>
        <div className="form card mx-auto">
          <div className="photo card-img-top mb-3" style={{backgroundImage: `url(${photo})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
          </div>
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
              <div className="row no-gutters d-flex justify-content-between">
              {success
                ? (<div className="badge badge-success">Your Loan is live on Ethereum</div>)
                : (
                  deposited
                  ? (
                    <>
                      <button href={contract}
                        onClick={event => setDownloaded(true)}
                        className="btn btn-primary mr-3"
                        download="contract.pdf"><FaFilePdf />
                        Download contract
                      </button>
                      <button
                        type="button"
                        disabled={!downloaded}
                        className="btn btn-lg btn-primary"
                        onClick={handleSign}>
                        Sign!
                      </button>
                    </>
                  )
                : (
                  <button type="button" className="btn btn-lg btn-primary" onClick={handleDeposit}>Finance!</button>
                  )
                )
              }
              </div>
            </div>
            <div className="form-group row">
              {}
            </div>
          </div>
        </div>
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
