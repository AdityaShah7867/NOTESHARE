import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormData, addNote } from "../redux/notes/noteActions";
import { getNotes } from "../redux/notes/noteActions";
import { toast } from "react-toastify";
import Alternates from "../components/Layout/MainLayout"
import * as GoogleGenerativeAI from "@google/generative-ai";
import { FaLightbulb, FaFileUpload } from 'react-icons/fa';

const NotesForm = () => {
  const dispatch = useDispatch();
  const AddNoteFormData = useSelector((state) => state?.note?.formdata);
  const branches = useSelector((state) => state?.note?.branches);
  const subjects = useSelector((state) => state?.note?.subjects);
  const noteAddLoading = useSelector((state) => state?.note?.noteLoading);

  const module = [1, 2, 3, 4, 5, 6];
  const type = ["Assignment", "Notes", "Question Paper", "Syllabus", "Other"];
  const [formdata, setFormdata] = useState({
    name: "",
    subject: "",
    module: "",
    type: "",
    desc: "",
    branch: "",
    file: null,
    year: 0,
    collaborators: [], // New field for collaborators
    deadline: "" // New field for deadline
  });

  const [aiSuggestions, setAiSuggestions] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // For PDF preview

  const API_KEY = "AIzaSyDZJoW_njjcjEfkHtaPWF79QkI9YWscwXs";

  const getAiSuggestions = async (text, field) => {
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let prompt = "";
      if (field === "name") {
        prompt = `Suggest a good title for a student note based on this partial input: "${text}". Keep it concise and academic. Just return the title suggestion.`;
      } else if (field === "desc") {
        prompt = `Suggest a brief description for a student note based on this partial input: "${text}". Keep it under 20 characters and academic. Just return the description suggestion.`;
      }

      const result = await model.generateContent(prompt);
      const suggestion = result.response.text();
      setAiSuggestions(suggestion);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if ((name === "name" || name === "desc") && value.length > 3) {
      getAiSuggestions(value, name);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setFormdata(prev => ({
          ...prev,
          file: file
        }));
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    const validations = [
      { condition: formdata.name.length < 10, message: "Name must be at least 10 characters long" },
      { condition: formdata.desc.length < 10, message: "Description must be at least 10 characters long" },
      { condition: !formdata.subject, message: "Please select a subject" },
      { condition: !formdata.module, message: "Please select a module" },
      { condition: !formdata.type, message: "Please select a type" },
      { condition: !formdata.file, message: "Please upload a file" }
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast.error(validation.message);
        return;
      }
    }

    try {
      await dispatch(addNote(formdata));
      await dispatch(getNotes());
      toast.success("Note added successfully!");
      // Reset form
      setFormdata({
        name: "",
        subject: "",
        module: "",
        type: "",
        desc: "",
        branch: "",
        file: null,
        year: 0,
        collaborators: [],
        deadline: ""
      });
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  useEffect(() => {
    dispatch(getFormData());
    dispatch(getNotes());
  }, [dispatch]);

  return (
    <Alternates>
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative min-h-screen">
        <div className="w-full max-w-4xl pt-4 bg-white rounded-xl shadow-2xl z-10 p-8">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <FaFileUpload className="text-blue-500" />
              Share Knowledge, Empower Learning
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your contributions help build a stronger learning community
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* Smart Title Input with AI Suggestions */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Title
                <div className="relative">
                  <input
                    type="text"
                    className="text-base w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formdata.name}
                    placeholder="Give your note a meaningful title..."
                    onChange={onChange}
                    name="name"
                    required
                  />
                  <FaLightbulb 
                    className="absolute right-3 top-3 text-yellow-400 cursor-pointer hover:text-yellow-500"
                    onClick={() => getAiSuggestions(formdata.name, "name")}
                  />
                </div>
              </label>
              {showSuggestions && document.activeElement.name === "name" && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                  <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors" 
                       onClick={() => {
                         setFormdata(prev => ({ ...prev, name: aiSuggestions }));
                         setShowSuggestions(false);
                       }}>
                    {aiSuggestions}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Subject Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 tracking-wide">
                  Subject
                  <select
                    className="text-base w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formdata.subject}
                    onChange={onChange}
                    name="subject"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects?.map((data, index) => (
                      <option key={index} value={data._id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-500 tracking-wide">
                  Module
                  <select
                    className="text-base w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formdata.module}
                    onChange={onChange}
                    name="module"
                    required
                  >
                    <option value="">Select Module</option>
                    {module.map((data, index) => (
                      <option key={index} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Type Control */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Type
                <select
                  className="text-base w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formdata.type}
                  onChange={onChange}
                  name="type"
                  required
                >
                  <option value="">Select Type</option>
                  {type.map((data, index) => (
                    <option key={index} value={data}>
                      {data}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Enhanced Description Field */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Description
                <textarea
                  className="text-base w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  value={formdata.desc}
                  onChange={onChange}
                  name="desc"
                  placeholder="Describe your note content..."
                  required
                />
              </label>
            </div>

            {/* Improved File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Upload Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center hover:bg-gray-50 transition-colors">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    {formdata.file ? (
                      <div className="text-center">
                        <p className="text-xl text-gray-600 font-semibold">
                          File Selected:
                        </p>
                        <p className="text-gray-800 text-2xl font-bold">
                          {formdata.file.name}
                        </p>
                        {previewUrl && (
                          <div className="mt-4">
                            <a 
                              href={previewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              Preview PDF
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <FaFileUpload className="text-5xl text-gray-400 group-hover:text-gray-600" />
                        <p className="pointer-none text-gray-600 pt-4 cursor-pointer">
                          <span className="text-sm">Drag and drop</span> files here <br /> or{" "}
                          <span className="text-blue-600 hover:underline">
                            select a file
                          </span>
                        </p>
                        <input
                          type="file"
                          name="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf"
                        />
                      </>
                    )}
                  </div>
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Accepted format: PDF only
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={noteAddLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg font-semibold 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                           hover:from-blue-600 hover:to-indigo-700 shadow-lg 
                           transform transition-all duration-300 hover:scale-[1.02]
                           ${noteAddLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {noteAddLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Share Note"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Alternates>
  );
};

export default NotesForm;