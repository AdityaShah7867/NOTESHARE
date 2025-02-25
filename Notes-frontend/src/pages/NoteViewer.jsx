import React, { useEffect, useState } from 'react';
import '../nviewer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSingleNote } from '../redux/notes/noteActions';
import Comments from '../components/Comments';
import Alternates from "../components/Layout/Nviewer"
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { bookMarkNotes } from '../redux/notes/noteActions';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import * as GoogleGenerativeAI from "@google/generative-ai";

const Nviewer = () => {
  const user = useSelector((state) => state?.user?.user)
  const [loader, setloader] = useState(true)
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [aiQuestions, setAiQuestions] = useState([])
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noteId } = useParams();
  const singlenote = useSelector((state) => state?.note?.singlenote)

  const API_KEY = "AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs";

  // Sanitize any user-generated content before rendering
  const sanitizeContent = (content) => {
    return DOMPurify.sanitize(content);
  }

  useEffect(() => {
    const loading = setTimeout(() => {
      setloader(false)
    }, 2000);
    
    // Fetch note data with proper error handling
    try {
      dispatch(getSingleNote(noteId))
    } catch (error) {
      toast.error('Error loading note');
      console.error(error);
    }

    return () => clearTimeout(loading);
  }, [dispatch, noteId])

  const getSummary = async () => {
    setSummaryLoading(true)
    try {
      const data = JSON.stringify({
        "url": singlenote.file
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url:'http://127.0.0.1:5000/summarize-pdf/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await axios.request(config);
      // Sanitize summary before setting state
      setSummary(sanitizeContent(response.data.summary));
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Error getting summary');
    }
    setSummaryLoading(false);
  }

  // New Gemini Integration Functions
  const generateQuestions = async () => {
    if (!summary) {
      toast.error('Please generate summary first');
      return;
    }
    
    setAiLoading(true);
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Based on this summary of the note ${summary}
      Generate 5 practice questions that would help test understanding of the material. Format as a JSON array of questions.`;
      
      const result = await model.generateContent(prompt);
      const questions = JSON.parse(result.response.text());
      setAiQuestions(questions);
    } catch (error) {
      toast.error('Error generating questions');
      console.error(error);
    }
    setAiLoading(false);
  }

  const getDetailedExplanation = async (topic) => {
    if (!summary) {
      toast.error('Please generate summary first');
      return;
    }

    setAiLoading(true);
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Based on this summary:
      
      ${summary}
      
      Explain this topic in detail: "${topic}" from the note "${singlenote?.name}". Include key concepts and examples.`;
      
      const result = await model.generateContent(prompt);
      setAiExplanation(result.response.text());
    } catch (error) {
      toast.error('Error getting explanation');
      console.error(error);
    }
    setAiLoading(false);
  }

  if (!loader && !singlenote?.purchased?.includes(user?._id)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-lock text-red-500 text-4xl"></i>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
              Access Denied
            </h1>
            <p className="text-gray-600 text-lg mb-8">You haven't purchased this note yet</p>
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={() => navigate('/')}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (loader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-12">
        <div className="lg:flex gap-10">
          {/* Left Column - PDF Viewer */}
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  {sanitizeContent(singlenote?.name)}
                </h1>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">Created by</span>
                  <span className="font-medium ml-1">
                    {sanitizeContent(singlenote?.author?.username)}
                  </span>
                </div>
              </div>
              
              <iframe
                className="w-full border border-gray-200 rounded"
                style={{height: "calc(100vh - 300px)", minHeight: "600px"}}
                src={`${singlenote.file}#toolbar=0&download=false&print=false`}
              ></iframe>
            </div>
          </div>

          {/* Right Column - Actions & Comments */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => dispatch(bookMarkNotes(singlenote?._id))}
                  className={`flex-1 flex items-center justify-center gap-2 ${user?.notesBookMarked?.includes(noteId) ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-100 hover:bg-gray-200'} text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200`}
                >
                  <i className="fa-regular fa-bookmark text-lg"></i>
                  {user?.notesBookMarked?.includes(noteId) ? <span> Unsave </span> : <span>Save</span>}
                </button>
                
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200"
                >
                  <i className="fa-regular fa-heart text-lg"></i>
                  <span>Appreciate</span>
                </button>
              </div>

              {/* AI Features Section */}
              <div className="space-y-4 mb-6">
                <button
                  onClick={getSummary}
                  disabled={summaryLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                >
                  {summaryLoading ? 'Getting Summary...' : 'Get AI Summary'}
                </button>

                {summary && (
                  <>
                    {/* <button
                      onClick={generateQuestions}
                      disabled={aiLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                    >
                      {aiLoading ? 'Generating...' : 'Generate Practice Questions'}
                    </button> */}

                    {/* <button
                      onClick={() => getDetailedExplanation(singlenote?.name)}
                      disabled={aiLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                    >
                      {aiLoading ? 'Generating...' : 'Get Detailed Explanation'}
                    </button> */}
                  </>
                )}
              </div>

              {/* AI Generated Content */}
              {summary && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md prose max-w-none">
                  <h3 className="font-medium mb-2">AI Summary:</h3>
                  <ReactMarkdown className="text-gray-700">
                    {summary}
                  </ReactMarkdown>
                </div>
              )}

              {aiQuestions.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Practice Questions:</h3>
                  <ul className="list-decimal pl-4 space-y-2">
                    {aiQuestions.map((q, i) => (
                      <li key={i} className="text-gray-700">{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiExplanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Detailed Explanation:</h3>
                  <ReactMarkdown className="text-gray-700">
                    {aiExplanation}
                  </ReactMarkdown>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-md p-6 mt-6">
                <Comments note={singlenote} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nviewer;
