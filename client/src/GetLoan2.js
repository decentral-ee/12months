import React, {useState, useContext, useRef} from 'react';
import {HistoryContext} from './context';
import {Page, Text, View, Document, StyleSheet, BlobProvider} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

export default function GetLoan2(props) {
  const {location} = props;
  const {photo, vin, model, year} = location.state;

  const history = useContext(HistoryContext);
  const [ask, setAsk] = useState();
  const [interest, setInterest] = useState();
  const [term, setTerm] = useState();
  const pdf = useRef();

  function handleNext() {
    const data = {
      photo: photo,
      vin: vin,
      model: model,
      year: year,
    };
    console.log(`Data to upload! `, data);

    // generate the contract pdf

    // next page
    history.push({
      pathname: '/loan/3',
      state: {
        ...data,
        ask: ask,
        interest: interest,
        term: term,
        pdf: pdf.current
      }
    });
  }

  const PdfDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{vin}</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <div>Conditions:</div>
      <div className="form-group row">
        <label htmlFor="vin" className="col-sm-2 col-form-label">Ask</label>
        <div className="col-sm-5">
          <input
            id="ask"
            type="text"
            className="form-control"
            value={ask}
            onChange={event => setAsk(event.target.value)}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="interest" className="col-sm-2 col-form-label">Interest</label>
        <div className="col-sm-5">
          <input
            id="interest"
            type="text"
            className="form-control"
            value={interest}
            onChange={event => setInterest(event.target.value)}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="term" className="col-sm-2 col-form-label">Term</label>
        <div className="col-sm-5">
          <input
            id="term"
            type="text"
            className="form-control"
            value={term}
            onChange={event => setTerm(event.target.value)}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="vin" className="col-sm-2 col-form-label"></label>
        <div className="col-sm-5">
          <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
        </div>
      </div>
      <BlobProvider document={PdfDoc}>
        {({ blob, url, loading, error }) => {
          if (!blob) { return null; }
          const reader = new FileReader(blob);
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            const base64data = reader.result;
            /* console.log(base64data); */
            pdf.current = base64data;
          }
          return null;
        }}
      </BlobProvider>
    </>
  );
}
