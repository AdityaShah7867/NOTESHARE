import React, { useState } from "react";
import Alternates from "../components/Layout/MainLayout";
import axios from "axios";

const ResumeReview = () => {
  const [resumeImage, setResumeImage] = useState(null);
  const [review,setReview]=useState(null)
  const [reviewGenerating,setreviewRegeneating]=useState(false)


  const resumeReview=async()=>{
    try {
        setreviewRegeneating(true)
            const response=await axios.post('http://localhost:4000/generate-content',{
                resume:resumeImage
            })

            if(response.status===200){
              console.log(response.data)
              setReview(response.data.generatedText)
            }
    } catch (error) {
        console.log(error)
    }
  }



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Alternates>
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative h-screen">
        <div className="w-full pt-4 bg-white z-10 h-screen-grow  border-2 p-10">
          <div className="text-center">
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
             Review Your Resume
            </h2>
          </div>
          <div className="mt-8 flex flex-col items-center">
            {/* Input field for uploading image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            {/* Display uploaded image */}
            {resumeImage && (
              <img
                src={resumeImage}
                alt="Uploaded Resume"
                className="max-w-full h-auto mb-4"
              />
            )}
       
            <div onClick={resumeReview} className="border border-gray-300 rounded p-2" >
                Review
            </div>

            {
                reviewGenerating && (
                    <div>
                    Generating Review...
                    </div>
                )
                
            }

            {
                review && (
                    <div>
                    {review}
                    </div>
                )
            }
          </div>
        </div>
      </div>
    </Alternates>
  );
};

export default ResumeReview;
