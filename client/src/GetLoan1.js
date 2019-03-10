import React, {useState, useRef, useContext} from 'react';
import {HistoryContext} from './context';
import Image from './images/image2.svg';
import { FaUpload } from 'react-icons/fa';

export default function GetLoan1() {
  const history = useContext(HistoryContext);
  const [photo, setPhoto] = useState(Image);
  const [vin, setVin] = useState("CR1PT0T0TH3M00N");
  const [year, setYear] = useState("2017");
  const [model, setModel] = useState("Rekt Lambo");
  const [idNumber, setIdNumber] = useState("133713371337");

  const svg = `<svg viewBox="25 25.1 89.8 90.7" xmlns="http://www.w3.org/2000/svg" class="wheel"><path d="m94.5 85.5c3.2 4.3 6.5 8.7 9.8 13.1-6.6 7.8-14.8 12.8-24.7 14.9-11 2.3-21.4.6-31.5-5 9-6.7 17.8-13.3 26.7-19.9 2 1.9 3.9 3.8 5.8 5.6 2.1 2 1.3 2.1 4 .6 3.7-2.1 6.8-5 9.2-8.5.1-.2.3-.4.4-.6-.1 0 0 0 .3-.2zm-39.3 8.8c-2.5 1.9-4.8 3.6-7.1 5.4-1.7 1.3-3.4 2.5-5.1 3.8-.7.6-1.2.6-2-.1-7.6-6.8-12.4-15.2-14.2-25.2-1.8-10.1-.2-19.7 4.6-28.8.1-.2.3-.5.4-.7 0-.1.1-.1.3-.2 6.6 8.7 13.3 17.4 19.9 26.1-.2.3-.3.5-.5.7-2 2.1-4 4.2-6.1 6.2-.6.6-.7 1.1-.3 1.8 2.1 4 5 7.3 8.6 10 .5.3.9.6 1.5 1zm37.3-62.1c-3.2 2.3-6.4 4.6-9.6 6.8-5.5 3.9-11 7.9-16.4 11.8-.7.5-1.2.6-1.8-.1-1.8-1.9-3.7-3.6-5.5-5.5-.5-.5-1-.6-1.7-.3-4.3 2.2-7.7 5.3-10.5 9.2-.2.2-.4.5-.6.8-1.6-2.1-3.1-4-4.6-6-1.6-2.1-3.1-4.2-4.6-6.2-.5-.7-.6-1.2.1-1.9 7.7-8.5 17.2-13.5 28.6-14.7 9-1 17.6.8 25.6 5.1.3.2.6.3.9.5 0 .3 0 .4.1.5zm16.3 60c-2.1-2.7-4-5.2-5.9-7.7-4.4-5.8-8.8-11.7-13.3-17.5-.6-.8-.6-1.3.1-2 1.9-1.9 3.7-3.8 5.6-5.7.5-.5.7-1 .3-1.7-2.2-4.2-5.2-7.7-9.1-10.5-.3-.2-.6-.5-1-.7.3-.3.6-.5.8-.7 3.8-2.9 7.6-5.7 11.4-8.6.6-.5 1.1-.7 1.8 0 9.5 8.6 14.6 19.3 15.1 32.2.2 7.5-1.5 14.6-4.9 21.3-.3.4-.6.9-.9 1.6z" fill="#231815"></path></svg>
 `;
  console.log(svg);
  /*
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
  }*/

  //  upload photo
  const uploadFileInput = useRef(null);
  function handleUploadFile(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }

    if (!uploadFileInput.current) { return; }
    const input = uploadFileInput.current;
    input.click();

    //  register change listener as React onChange is not working for some reason
    input.addEventListener('change', handleFilesSelected);
  }

  async function handleFilesSelected(event) {
    //  stop default events
    event.preventDefault();
    event.stopPropagation();
    if (event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }
    const files = fileListToFilesArray(event.target.files);
    const input = uploadFileInput.current;
    // console.log(`Uploading files: `, files[0]);

    if (input) {
      input.value = '';
      input.removeEventListener('change', handleFilesSelected);
    }

    //  upload files
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const fileBase64 = reader.result;
      console.log(`File base64!  `, fileBase64);
      setPhoto(fileBase64);
    }, false);
    reader.readAsDataURL(files[0]);

    //  put change listener back
    if (input) {
      input.addEventListener('change', handleFilesSelected);
    }
  }

  function handleNext() {
    const data = {
      photo: photo,
      vin: vin,
      model: model,
      year: year,
      idNumber: idNumber
    };
    console.log(`Data to upload! `, data);

    // next page
    history.push({
      pathname: '/loan/2',
      state: {
        ...data
      }
    });
  }

  return (
    <>
      <div className="body">
        <div className="card-title">Car Details:</div>
        <div className="form card mx-auto">
          <div style={{position: 'absolute', top: '127px' ,width: '38px', right: '173px'}} dangerouslySetInnerHTML={{__html : svg}}  ></div>
          <div style={{position: 'absolute', top: '127px' ,width: '38px', right: '43px'}} dangerouslySetInnerHTML={{__html : svg}}  ></div>
          <div className="photo card-img-top mb-3" style={{backgroundImage: `url(${photo})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            <div className="upload">
              <button type="button" className="float-right btn btn-primary m-3" onClick={handleUploadFile}>
                <FaUpload />
              </button>
              <input ref={uploadFileInput} type="file" style={{display: 'none'}} />
            </div>
          </div>
          <div className="px-4">
            <div className="form-group row">
              <label htmlFor="vin" className="col-sm-4 col-form-label">VIN</label>
              <div className="col-sm-8">
                <input
                  id="vin"
                  type="text"
                  placeholder="WBA5E5106GG071740"
                  className="form-control"
                  value={vin}
                  onChange={event => setVin(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="model" className="col-sm-4 col-form-label">Model</label>
              <div className="col-sm-8">
                <input
                  id="model"
                  type="text"
                  className="form-control"
                  placeholder="Ford Focus"
                  value={model}
                  onChange={event => setModel(event.target.value)}
                />
                {/*
                  <Dropdown
                    label='Select'
                    items={model.items}
                    selected={model.selected}
                    isOpen={model.isOpen}
                    onClick={handleModelClick}
                    onSelect={handleModelSelect}
                  />
                  */}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="vin" className="col-sm-4 col-form-label">Year</label>
              <div className="col-sm-8">
                <input
                  id="year"
                  type="number"
                  className="form-control"
                  placeholder="2018"
                  value={year}
                  onChange={event => setYear(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="idNumber" className="col-sm-4 col-form-label">ID number</label>
              <div className="col-sm-8">
                <input
                  id="idNumber"
                  type="number"
                  className="form-control"
                  placeholder="90923209332"
                  value={idNumber}
                  onChange={event => setIdNumber(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="vin" className="col-sm-4 col-form-label"></label>
              <div className="col-sm-8">
                <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
              </div>
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
