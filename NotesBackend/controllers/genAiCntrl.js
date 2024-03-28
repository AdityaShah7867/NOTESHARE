const fs = require('fs');
const PDFParser = require('pdf2json');

// Function to convert PDF to text
function convertPDFToText(pdfPath) {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', function(data) {
        const text = pdfParser.getRawTextContent();
        console.log('text',text)
        console.log('PDF converted to text successfully!');
    });

    pdfParser.loadPDF(pdfPath);
}

// Usage example
const pdfPath = 'file.pdf';


convertPDFToText(pdfPath);