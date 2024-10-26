import React, { useState } from "react";
import Alternates from "../components/Layout/MainLayout";
import axios from "axios";

const ResumeReview = () => {
  const [resumeImage, setResumeImage] = useState(null);
  const [review, setReview] = useState(null);
  const [reviewGenerating, setReviewGenerating] = useState(false);

  const resumeReview = async () => {
    try {
      setReviewGenerating(true);
      const resumeFormdata = new FormData();
      resumeFormdata.append('resume', resumeImage);

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/generate-content`,
        resumeFormdata,
        {
          headers: {
            "Content-Type": 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setReview(response.data.generatedText);
      }
    } catch (error) {
      console.error("Error generating review:", error);
    } finally {
      setReviewGenerating(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeImage(file);
    }
  };

  return (
    <Alternates>
      <div className="min-h-screen bg-gradient-to-br  py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Review Assistant</h1>
            <p className="text-lg text-gray-600">Get professional feedback on your resume instantly</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div className="relative">
                  <label 
                    htmlFor="resume-upload" 
                    className="block text-lg font-medium text-gray-700 mb-4"
                  >
                    Upload Your Resume
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
                    <input
                      id="resume-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-600">Drag and drop your resume here or click to browse</p>
                    </div>
                  </div>
                </div>

                {resumeImage && (
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={URL.createObjectURL(resumeImage)}
                      alt="Uploaded Resume"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                )}

                <button
                  onClick={resumeReview}
                  disabled={!resumeImage || reviewGenerating}
                  className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                    !resumeImage || reviewGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {reviewGenerating ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Analyzing Resume...
                    </div>
                  ) : (
                    'Get Review'
                  )}
                </button>
              </div>

              {/* Review Section */}
              <div className={`transition-opacity duration-300 ${review ? 'opacity-100' : 'opacity-50'}`}>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Review</h2>
                  {review ? (
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review}</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <i className="far fa-file-alt text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-500">Upload your resume to get professional feedback</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Alternates>
  );
};

export default ResumeReview;
