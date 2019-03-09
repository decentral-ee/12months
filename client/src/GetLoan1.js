import React, {useState, useRef, useContext} from 'react';
import {Dropdown} from './ui/dropdown';
import {HistoryContext} from './context';
import Image from './images/image.svg';
import { FaUpload } from 'react-icons/fa'

export default function GetLoan1() {
  const history = useContext(HistoryContext);
  const [photo, setPhoto] = useState(Image);
  const [vin, setVin] = useState();
  const [year, setYear] = useState();
  const [model, setModel] = useState();
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
      year: year
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
      <div className="header"></div>
      <div className="body">
        <div className="form card mx-auto">
          <div className="photo card-img-top mb-3" style={{backgroundImage: `url(${photo})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            <div className="upload">
              <button type="button" className="float-right btn btn-primary" onClick={handleUploadFile}>
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
                  placeHolder=""
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
                  placeHolder="Ford Focus"
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
                  placeHolder="2018"
                  value={year}
                  onChange={event => setYear(event.target.value)}
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
