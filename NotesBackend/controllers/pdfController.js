const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

// Configure Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Function to download PDF from URL and save it locally
const downloadPDF = async (pdfUrl, localPath = "./temp.pdf") => {
  try {
    const response = await axios({
      method: 'get',
      url: pdfUrl,
      responseType: 'arraybuffer' // Changed to arraybuffer
    });

    // Write the PDF buffer to file
    fs.writeFileSync(localPath, response.data);
    return localPath;

  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF file");
  }
};

// Function to extract text from PDF
const extractTextFromPDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.on("pdfParser_dataError", (error) => {
      reject(error);
    });

    pdfParser.loadPDF(pdfPath);
  });
};

// Function to summarize text using Gemini
const summarizeText = async (text) => {
  const prompt = `Please provide a concise and structured summary of the following text. 
    Focus on the main ideas and key points, removing unnecessary details and jargon. 
    Present the summary in a bulleted list format for clarity, ensuring each point is clear, 
    easy to understand, and captures the essence of the content:\n\n${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Controller function to handle PDF summarization
const getSummary = async (req, res) => {
  const pdfUrl = req.body.url;

  if (!pdfUrl) {
    return res.status(400).json({ error: "PDF URL is required." });
  }

  let pdfPath = null;

  try {
    // Ensure uploads directory exists
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    pdfPath = path.join(uploadsDir, 'temp.pdf');
    await downloadPDF(pdfUrl, pdfPath);

    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file was not created successfully");
    }

    const text = await extractTextFromPDF(pdfPath);
    const summary = await summarizeText(text);

    // Clean up temporary file
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    res.json({ summary });
  } catch (error) {
    console.error("Error in getSummary:", error);
    // Clean up on error
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSummary
};
