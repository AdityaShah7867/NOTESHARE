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
import { likeUnlikeNote } from '../redux/likes/likeActions';
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
  const [activeTab, setActiveTab] = useState('view') // Options: 'view', 'summary', 'comments'
  const [fullscreen, setFullscreen] = useState(false)
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
    setActiveTab('summary')
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

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  }

  // Handle like functionality
  const handleLike = async () => {
    try {
      await dispatch(likeUnlikeNote(noteId));
      // Refresh note data to update like count
      await dispatch(getSingleNote(noteId));
      toast.success('Note appreciation updated!');
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to update appreciation');
    }
  }

  if (!loader && !singlenote?.purchased?.includes(user?._id)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
          <div className="text-center">
            <div className="bg-red-900/30 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 border border-red-800/50">
              <i className="fas fa-lock text-red-400 text-4xl"></i>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-100 mb-3 bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
              Access Denied
            </h1>
            <p className="text-gray-400 text-lg mb-8">You haven't purchased this note yet</p>
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Header Area */}
      <div className={`fixed top-0 w-full z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 backdrop-blur-sm transition-all duration-300 ${fullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto px-4 py-3">
          {/* Main header with title and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-blue-600/20 hover:shadow-md hover:shadow-blue-500/10 transition-all group"
              >
                <i className="fas fa-arrow-left group-hover:-translate-x-0.5 transition-transform"></i>
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                <h1 className="text-lg md:text-xl font-semibold text-white line-clamp-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300">
                  {sanitizeContent(singlenote?.name)}
                </h1>
                
                <div className="flex items-center text-xs text-gray-400">
                  <div className="flex items-center">
                    <img 
                      src={`${process.env.REACT_APP_API_HOST}/${singlenote?.author?.profile}`} 
                      alt={singlenote?.author?.username} 
                      className="w-5 h-5 rounded-full border border-blue-600 mr-1.5"
                    />
                    <span className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                      {sanitizeContent(singlenote?.author?.username)}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-gray-500">
                    {singlenote?.uploadedAt ? new Date(singlenote.uploadedAt).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'}) : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Subject info - moved from action buttons */}
            <div className="hidden md:flex bg-gray-800/60 p-1 rounded-lg border border-gray-700/50 shadow-inner">
              <div className="flex items-center bg-gray-800/30 backdrop-blur-sm px-2 py-1 rounded text-gray-400 text-xs">
                <i className="fas fa-book mr-1.5 text-blue-400"></i>
                <span>{singlenote?.subject?.name || 'General'}</span>
                <span className="mx-1.5 text-gray-600">•</span>
                <span>Module {singlenote?.module || '0'}</span>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center mt-3">
            <div className="flex bg-gray-800/40 rounded-lg p-1 border border-gray-700/50 shadow-inner">
              <button
                onClick={() => setActiveTab('view')}
                className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                  activeTab === 'view' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <i className="fas fa-file-pdf mr-1.5 opacity-80"></i>
                View Note
              </button>
              
              <button
                onClick={() => {
                  if (summary) {
                    setActiveTab('summary');
                  } else {
                    getSummary();
                  }
                }}
                className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                  activeTab === 'summary' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <i className="fas fa-robot mr-1.5 opacity-80"></i>
                AI Summary
              </button>
              
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                  activeTab === 'comments' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <i className="fas fa-comments mr-1.5 opacity-80"></i>
                Comments
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className={`container mx-auto px-4 transition-all duration-300 ${fullscreen ? 'pt-0' : 'pt-28'}`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* PDF Viewer */}
          <div className={`${fullscreen ? 'w-full h-screen fixed top-0 left-0 z-20' : 'lg:w-2/3'} transition-all duration-300 relative`}>
            <div className={`bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 ${fullscreen ? 'h-full rounded-none border-0' : ''}`}>
              <iframe
                className="w-full border-0"
                style={{height: fullscreen ? "100vh" : "calc(100vh - 220px)", minHeight: "500px"}}
                src={`${singlenote.file}#toolbar=0&download=false&print=false`}
              ></iframe>
              
              {/* Floating Action Buttons - now positioned on the PDF viewer */}
              <div className={`absolute top-3 right-3 flex flex-col items-center space-y-2 z-30 ${fullscreen ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg p-1.5 flex flex-col space-y-2">
                  <button
                    onClick={() => dispatch(bookMarkNotes(singlenote?._id))}
                    className={`p-2 rounded-lg transition-all ${
                      user?.notesBookMarked?.includes(noteId) 
                        ? 'text-red-400 bg-red-900/20' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/70'
                    }`}
                    title={user?.notesBookMarked?.includes(noteId) ? "Unsave" : "Save"}
                  >
                    <i className={`${user?.notesBookMarked?.includes(noteId) ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>
                  </button>
                  
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-all ${
                      singlenote?.likes?.includes(user?._id)
                        ? 'text-pink-400 bg-pink-900/20' 
                        : 'text-gray-400 hover:text-pink-400 hover:bg-gray-700/70'
                    }`}
                    title="Appreciate"
                  >
                    <i className={`${singlenote?.likes?.includes(user?._id) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/70 transition-all"
                    title="Toggle fullscreen"
                  >
                    <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                  </button>
                </div>
              </div>
              
              {/* Floating pill that shows when hovering in fullscreen mode */}
              {fullscreen && (
                <div className="group fixed top-0 left-0 w-full h-16 z-20">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg px-5 py-2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => navigate(-1)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/70 transition-all"
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <span className="text-white truncate max-w-xs">{sanitizeContent(singlenote?.name)}</span>
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/70 transition-all"
                    >
                      <i className="fas fa-compress"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - only shown when not in fullscreen */}
          {!fullscreen && (
            <div className="lg:w-1/3">
              {activeTab === 'view' && (
                <div className="bg-gray-800 rounded-lg shadow-xl p-5 border border-gray-700">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                        <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                        Note Information
                      </h3>
                      <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Subject</p>
                          <p className="font-medium text-gray-200">{singlenote?.subject?.name || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Module</p>
                          <p className="font-medium text-gray-200">{singlenote?.module || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Uploaded on</p>
                          <p className="font-medium text-gray-200">{new Date(singlenote?.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                        <i className="fas fa-robot text-purple-400 mr-2"></i>
                        AI Features
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={getSummary}
                          disabled={summaryLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                        >
                          {summaryLoading ? (
                            <>
                              <span className="mr-2">
                                <i className="fas fa-spinner fa-spin"></i>
                              </span>
                              Generating Summary...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-alt mr-2"></i>
                              Get AI Summary
                            </>
                          )}
                        </button>

                        {summary && (
                          <>
                            <button
                              onClick={generateQuestions}
                              disabled={aiLoading}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                            >
                              {aiLoading ? (
                                <>
                                  <span className="mr-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                  </span>
                                  Generating Questions...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-question-circle mr-2"></i>
                                  Generate Practice Questions
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => getDetailedExplanation(singlenote?.name)}
                              disabled={aiLoading}
                              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                            >
                              {aiLoading ? (
                                <>
                                  <span className="mr-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                  </span>
                                  Generating Explanation...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-lightbulb mr-2"></i>
                                  Get Detailed Explanation
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="bg-gray-800 rounded-lg shadow-xl p-5 border border-gray-700">
                  {summaryLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 mb-4">
                        <Loader />
                      </div>
                      <p className="text-gray-400">Generating summary, please wait...</p>
                    </div>
                  ) : summary ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                          <i className="fas fa-file-alt text-blue-400 mr-2"></i>
                          AI Summary
                        </h3>
                        <div className="bg-gray-700/30 rounded-lg p-5">
                          <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                            {summary}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {aiQuestions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                            <i className="fas fa-question-circle text-purple-400 mr-2"></i>
                            Practice Questions
                          </h3>
                          <div className="bg-gray-700/30 rounded-lg p-5">
                            <ul className="list-decimal pl-4 space-y-3">
                              {aiQuestions.map((q, i) => (
                                <li key={i} className="text-gray-300">{q}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {aiExplanation && (
                        <div>
                          <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                            <i className="fas fa-lightbulb text-green-400 mr-2"></i>
                            Detailed Explanation
                          </h3>
                          <div className="bg-gray-700/30 rounded-lg p-5">
                            <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                              {aiExplanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {!aiQuestions.length && (
                          <button
                            onClick={generateQuestions}
                            disabled={aiLoading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                          >
                            {aiLoading ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <>
                                <i className="fas fa-question-circle mr-2"></i>
                                Generate Questions
                              </>
                            )}
                          </button>
                        )}

                        {!aiExplanation && (
                          <button
                            onClick={() => getDetailedExplanation(singlenote?.name)}
                            disabled={aiLoading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                          >
                            {aiLoading ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <>
                                <i className="fas fa-lightbulb mr-2"></i>
                                Get Explanation
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-700/50">
                        <i className="fas fa-robot text-blue-400 text-3xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No Summary Available</h3>
                      <p className="text-gray-400 mb-6">Click the button below to generate an AI summary of this note</p>
                      <button
                        onClick={getSummary}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                      >
                        Generate Summary
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="bg-gray-800 rounded-lg shadow-xl p-5 border border-gray-700">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <i className="fas fa-comments text-blue-400 mr-2"></i>
                      Comments
                    </h3>
                  </div>
                  <Comments note={singlenote} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nviewer;
