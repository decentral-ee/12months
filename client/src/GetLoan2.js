import React, {useState, useContext, useRef} from 'react';
import {HistoryContext} from './context';
import {Page, Text, View, Image, Document, StyleSheet, BlobProvider} from '@react-pdf/renderer';
import {Line} from 'react-chartjs-2';
// Create styles
const svg = `<svg viewBox="25 25.1 89.8 90.7" xmlns="http://www.w3.org/2000/svg" class="wheel"><path d="m94.5 85.5c3.2 4.3 6.5 8.7 9.8 13.1-6.6 7.8-14.8 12.8-24.7 14.9-11 2.3-21.4.6-31.5-5 9-6.7 17.8-13.3 26.7-19.9 2 1.9 3.9 3.8 5.8 5.6 2.1 2 1.3 2.1 4 .6 3.7-2.1 6.8-5 9.2-8.5.1-.2.3-.4.4-.6-.1 0 0 0 .3-.2zm-39.3 8.8c-2.5 1.9-4.8 3.6-7.1 5.4-1.7 1.3-3.4 2.5-5.1 3.8-.7.6-1.2.6-2-.1-7.6-6.8-12.4-15.2-14.2-25.2-1.8-10.1-.2-19.7 4.6-28.8.1-.2.3-.5.4-.7 0-.1.1-.1.3-.2 6.6 8.7 13.3 17.4 19.9 26.1-.2.3-.3.5-.5.7-2 2.1-4 4.2-6.1 6.2-.6.6-.7 1.1-.3 1.8 2.1 4 5 7.3 8.6 10 .5.3.9.6 1.5 1zm37.3-62.1c-3.2 2.3-6.4 4.6-9.6 6.8-5.5 3.9-11 7.9-16.4 11.8-.7.5-1.2.6-1.8-.1-1.8-1.9-3.7-3.6-5.5-5.5-.5-.5-1-.6-1.7-.3-4.3 2.2-7.7 5.3-10.5 9.2-.2.2-.4.5-.6.8-1.6-2.1-3.1-4-4.6-6-1.6-2.1-3.1-4.2-4.6-6.2-.5-.7-.6-1.2.1-1.9 7.7-8.5 17.2-13.5 28.6-14.7 9-1 17.6.8 25.6 5.1.3.2.6.3.9.5 0 .3 0 .4.1.5zm16.3 60c-2.1-2.7-4-5.2-5.9-7.7-4.4-5.8-8.8-11.7-13.3-17.5-.6-.8-.6-1.3.1-2 1.9-1.9 3.7-3.8 5.6-5.7.5-.5.7-1 .3-1.7-2.2-4.2-5.2-7.7-9.1-10.5-.3-.2-.6-.5-1-.7.3-.3.6-.5.8-.7 3.8-2.9 7.6-5.7 11.4-8.6.6-.5 1.1-.7 1.8 0 9.5 8.6 14.6 19.3 15.1 32.2.2 7.5-1.5 14.6-4.9 21.3-.3.4-.6.9-.9 1.6z" fill="#231815"></path></svg>
`;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    margin: 10,
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 35,
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  paragraph: {
    marginTop: 10
  },
  section: {
    flexDirection: 'row',
    flexGrow: 1
  },
  column: {
    minWidth: 200,
    maxWidth: '1200px',
    flexGrow: 0.5
  }
});

export default function GetLoan2(props) {
  const {location} = props;
  const {photo, vin, model, year, idNumber} = location.state;
  const history = useContext(HistoryContext);
  const [ask, setAsk] = useState(500);
  const [interest, setInterest] = useState(10);
  const [term, setTerm] = useState(12);
  const pdf = useRef();
  const pdfBytes = useRef();
  const today = new Date();

  function handleNext() {
    const data = {
      photo: photo,
      vin: vin,
      model: model,
      year: year,
      idNumber: idNumber,
      ask: ask,
      interest: interest,
      term: term,
      pdf: pdf.current,
      pdfBytes: pdfBytes.current
    };

    // generate the contract pdf

    // next page
    history.push({
      pathname: '/loan/3',
      state: {
        ...data,
      }
    })
  }
  function formatDate(today){
    const dd = today.getDate()<10
      ? "0"+today.getDate()
      : today.getDate();
    const mm = (today.getMonth()+1)<10
      ? "0"+today.getMonth()+1
      : today.getMonth(1)+1;
    const yyyy = today.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }
  const PdfDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Collateralized Loan Contract</Text>
        </View>
        <View style={styles.section}>
          <Text>Post Date: {()=>formatDate(today)}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.column}>
            <Text>Car Model: {model}</Text>
            <Text>Car year: {year}</Text>
            <Text>VIN# : {vin}</Text>
          </View>
          <View style={styles.column}>
            <Text>Loan Amount: {ask}DAI</Text>
            <Text>interest: {interest}%</Text>
            <Text>Term: {term} days</Text>
          </View>
        </View>
        <View>
          <Image
            style={styles.image}
            src={photo}
          />
        </View>
        <View style={styles.column}>
          <Text  style={styles.paragraph}   >
            The parts of this contract are the two signatories.
            The debtor is signer#1, personal ID number {idNumber}, owner of the vehicle.
            The creditor is the second signer.
          </Text>
          <Text style={styles.paragraph}>
            If the loan indicated is not repayed by the term specified by this contract, the property of the vehicle listed above, of which I am the sole owner, will be transferred to the creditor.
          </Text>
          <Text style={styles.paragraph}>
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
  /*
  const chartData = {
      labels: ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December', 'January', 'February', 'March'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data:
        }
      ]
    };*/

  return (
    <>
      <div className="body">
        <div className="card-title">Conditions:</div>
            <div id="frontWheel" class="wheels" style={{position: 'absolute', top: '128px' ,width: '38px', right: '173px'}} dangerouslySetInnerHTML={{__html : svg}}  ></div>
            <div id="backWheel" class="wheels" style={{position: 'absolute', top: '127px' ,width: '38px', right: '43px'}} dangerouslySetInnerHTML={{__html : svg}}  ></div>
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
          <div className="row">
            {/*<Line data={chartData} width={300} height={200}> </Line> */}
          </div>
          <div className="form-group row">
            <label htmlFor="vin" className="col-sm-4 col-form-label"></label>
            <div className="col-sm-8">
              <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <BlobProvider document={PdfDoc}>
        {({ blob, url, loading, error }) => {
          if (!blob) { return null; }
          const reader = new FileReader(blob);
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            const base64data = reader.result;
            pdf.current = base64data;
          }
          const reader2 = new FileReader(blob);
          reader2.readAsArrayBuffer(blob);
          reader2.onloadend = function() {
            const arrayBuffer = reader2.result;
            pdfBytes.current = new Uint8Array(arrayBuffer);
          }
          return null;
        }}
      </BlobProvider>
    </>
  );
}
