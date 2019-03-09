const PDFDocument = require('pdfkit');

function applyTemplate(details) {
  return `This is the pdf template text.
details: ${JSON.stringify(details)};
You will sign this.
`;
}

module.exports = async function genereateContract(stream, details) {
  const doc = new PDFDocument;
  doc.pipe(stream);
  doc.addPage()
     .fontSize(25)
     .text(applyTemplate(details));
  doc.end();
};
