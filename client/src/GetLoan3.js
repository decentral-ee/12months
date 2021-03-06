import React, {useState, useContext} from 'react';
import {sign} from './id-card';
import * as Web3Utils from 'web3-utils';
import { FaFilePdf, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import {HistoryContext} from './context';
import {ApiContext, Web3Context} from './context';
import {createDeal, updateDeal} from './api';
import {mintNFT, signOrder, approvalForAllAsync} from './zerox';

export default function GetLoan3(props) {
  const {location} = props;
  const {pdf, pdfBytes, vin, model, year, photo, idNumber, ask, interest, term} = location.state;
  const [signature, setSignature] = useState();
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(0);
  const [status, setStatus] = useState('signing contract...');
  const apiURI = useContext(ApiContext);
  const history = useContext(HistoryContext);
  const {web3, ethereum} = useContext(Web3Context);

  async function handleSign() {
    const pdfHex = uint8ArrayToHex(pdfBytes);
    const pdfHash = Web3Utils.sha3(`0x${pdfHex}`).slice(2);

    console.log(`PDF! Hash: ${pdfHash}, hex: `, pdfHex);

    //  const docHash = '413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2';
    try {

      setLoading(1);
      const signature = await sign(pdfHash);
      //const signature = { hex: 'a33635e931a1a3fb5b31b463ee5b46e78cf8fb45d2c48618e8d4668f19c9d4930287232ef39159086c9a848c541dc2784754146a91fa5987dd53e6577e531225be1f3f63873e03ecd012c326b116353233fdc6e7de2bf1ef3c84c0ff94dce3fd' };
      console.log(`Signature! `, signature);
      setSignature(signature.hex);

      // send f to the server
      console.log(`Starting to send files! Api: ${apiURI}`);
      setStatus('uploading contract...');
      setLoading(2);
      const {dealId} = await createDeal(apiURI, pdfHex, signature.hex, location.state);
      console.log(`Sent files! Deal id: ${dealId}`);

      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      console.log(`My account: ${from}`);

      // mint the nft
      setStatus('Please Sign on Metamask');
      setLoading(3);
      if (ethereum) {
        await ethereum.enable();
      }
      const {tokenId, txHash} = await mintNFT(web3, from, dealId);
      console.log(`NFT Minted! hash: ${txHash}, tokenId: ${tokenId}`);

      // sign the order
      const {zxOrder, zxSignature} = await signOrder(web3, from, tokenId);
      console.log(`NFT order signed! signedOrder: ${zxSignature}`);
      await updateDeal(apiURI, dealId, {
        zxOrderSignature: zxSignature,
        zxOrder: zxOrder
      });

      approvalForAllAsync(from);

      setLoading(4);
      setStatus('Transaction successful');
      setTimeout(()=>{
        handleSuccess(dealId, tokenId, txHash);
      },6000);
    } catch (event) {
      console.log(`Signing failed!`, event);
    }
  }

  function handleSuccess(dealId, tokenId, txHash) {
    const data = {
      success: true,
      photo: photo,
      vin: vin,
      model: model,
      year: year,
      ask: ask,
      interest: interest,
      term: term,
      pdf: pdf.current,
      pdfBytes: pdfBytes.current,
      tokenId,
      txHash
    };

    // next page -> listing page with extra custom message
    const path = '/deal/'+dealId;
    history.push({
      pathname: path,
      state: {
        ...data,
      }
    });
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
          {loading>0
           && (<div id="status" className={
             loading <2
               ? "text-danger"
               : (loading === 2
                  ? "text-warning"
                  : (loading>3
                     ? "text-success"
                     : "text-danger"
                    )
                 )
           }>
                  {status}
                  {loading === 2
                   ? <FaSpinner className="ml-2 fa-spin faa-spin animated"/>
                   : (
                     loading === 3 || loading === 1
                       ? <FaExclamationTriangle className="ml-2"  />
                       : <FaCheckCircle className="ml-2" />
                   )
                  }
                </div>)
          }
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
