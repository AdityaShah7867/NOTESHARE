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
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-300">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Review Your Resume
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4 p-2 border border-gray-400 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {resumeImage && (
            <img
              src={URL.createObjectURL(resumeImage)}
              alt="Uploaded Resume"
              className="max-w-full h-64 object-contain rounded mb-4 border border-gray-300"
            />
          )}
          <button
            onClick={resumeReview}
            className={`w-full text-white font-semibold py-2 rounded transition duration-200 ${
              reviewGenerating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={reviewGenerating}
          >
            {reviewGenerating ? 'Generating Review...' : 'Review'}
          </button>
          {review && (
            <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
              <h3 className="font-semibold text-lg">Review:</h3>
              <p className="text-gray-800">{review}</p>
            </div>
          )}
        </div>
      </div>
    </Alternates>
  );
};

export default ResumeReview;
