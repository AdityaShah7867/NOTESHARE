// Import dependencies
const AWS = require('aws-sdk');
const axios = require('axios');
require('dotenv').config();


// Configure AWS Textract and S3
AWS.config.update({ region: 'us-east-2' });
const textract = new AWS.Textract();
const s3 = new AWS.S3();

// Function to extract text from PDF using Textract
async function extractTextFromPDF(s3Bucket, s3Key) {
  try {
    const params = {
      Document: {
        S3Object: {
          Bucket: s3Bucket,
          Name: s3Key,
        },
      },
      FeatureTypes: ['TABLES', 'FORMS'], // You can use 'TABLES', 'FORMS', or both
    };

    const textractData = await textract.analyzeDocument(params).promise();
    const textBlocks = textractData.Blocks.filter(block => block.BlockType === 'LINE');
    const extractedText = textBlocks.map(block => block.Text).join(' ');

    return extractedText;
  } catch (error) {
    console.error('Error extracting text from PDF with Textract:', error);
    throw error;
  }
}

// Function to evaluate language quality using Hugging Face
async function evaluateLanguageQuality(text) {
  try {
    const huggingFaceResponse = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );

    // Interpret the sentiment result
    const sentiment = huggingFaceResponse.data[0].label;
    const score = huggingFaceResponse.data[0].score;

    return `Sentiment: ${sentiment} with a confidence of ${score}`;
  } catch (error) {
    console.error('Error evaluating language quality with Hugging Face:', error);
    throw error;
  }
}

// Main function to process the PDF and evaluate language quality
async function processPDF(s3Bucket, s3Key) {
  try {
    // Step 1: Extract text from PDF
    const extractedText = await extractTextFromPDF(s3Bucket, s3Key);
    console.log('Extracted Text:', extractedText);

    // Step 2: Evaluate language quality
    const languageQualityFeedback = await evaluateLanguageQuality(extractedText);
    console.log('Language Quality Feedback:', languageQualityFeedback);

  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Run the main function with S3 bucket and key
processPDF(process.env.AWS_BUCKET_NAME, '1729942381898.pdf ');
