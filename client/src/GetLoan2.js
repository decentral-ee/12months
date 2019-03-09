import React, {useState, useContext, useRef} from 'react';
import {HistoryContext} from './context';
import {Page, Text, View, Document, StyleSheet, BlobProvider} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  column: {
    minWidth: 200,
    flexGrow: 0.5
  }
});

export default function GetLoan2(props) {
  const {location} = props;
  const {photo, vin, model, year} = location.state;
  const history = useContext(HistoryContext);
  const [ask, setAsk] = useState(500);
  const [interest, setInterest] = useState(10);
  const [term, setTerm] = useState(12);
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
          <Text>Collateralized Loan Contract</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.column}>
            <Text>Car Model: {model}</Text>
            <Text>Car year: {year}</Text>
            <Text>Vin# : {vin}</Text>
          </View>
          <View style={styles.column}>
            <Text>Loan Amount: {ask}DAI</Text>
            <Text>interest: {interest}%</Text>
            <Text>Term: {term} days</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text>
            If the loan indicated is not repayed by the term specified by this contract, the property of the vehicle listed above, of which I am the sole owner, will be transferred to the financer.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, tale munere qui in, ut sint soleat lucilius eam. Eu vivendo civibus accusamus pro, inimicus reprehendunt eam id. His ut alia debitis fastidii. Feugait urbanitas ex eum, sit in brute errem mediocritatem.
            At antiopam repudiandae nec. Ad his probo libris suscipit, ut vitae salutatus incorrupte sea, vel in quem magna regione. Ei nam esse platonem vulputate. Sed ei noluisse neglegentur, ad dico accumsan his, iuvaret diceret vituperatoribus usu cu. Ex perpetua oportere gloriatur pri, amet mentitum explicari ei eum.
            Qui utinam inermis no, ad tollit sadipscing his, dicant placerat in eum. Verear delectus vulputate te sed. Sea at erant ceteros reprehendunt, vim suas gloriatur ad. Vis ex ridens inciderint ullamcorper, est et noster nonumes indoctum, hinc indoctum cum ei. Cum altera facilisi scripserit eu, ancillae invenire ut has. Mea id simul ceteros, cu vel regione patrioque hendrerit.
            Duo et stet fabulas assentior. Ne mazim melius iracundia pro, nominati suavitate cu sed. Ei has ullum everti albucius, ei invenire electram his. Per doctus referrentur ne, eu mea inani primis. Lorem expetendis quo et, vis ne stet latine.
            In oblique consetetur pro. Usu quot senserit intellegebat no, in mea nulla maiorum indoctum. Eu cum facer copiosae, mel ei duis eloquentiam. No his vidit epicuri, cum cu possim vocibus imperdiet. Has civibus concludaturque te.
          </Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <div className="body">
        <div className="card-title">Conditions:</div>
        <div id="getLoan2" className="form card mx-auto p-4">
          <div className="form-group row">
            <label htmlFor="ask" className="col-sm-4 col-form-label">Ask</label>
            <div className="col-sm-8 ask-input">
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
            <label htmlFor="interest" className="col-sm-4 col-form-label">Interest</label>
            <div className="col-sm-8 interest-input ">
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
            <label htmlFor="term" className="col-sm-4 col-form-label">Loan Term</label>
            <div className="col-sm-8 term-input">
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
            <label htmlFor="vin" className="col-sm-4 col-form-label"></label>
            <div className="col-sm-8">
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
        </div>
      </div>
    </>
  );
}
