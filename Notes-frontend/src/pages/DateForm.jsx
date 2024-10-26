import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormData, addNote } from "../redux/notes/noteActions";
import { getNotes } from "../redux/notes/noteActions";
import { toast } from "react-toastify";
import MainLayout from "../components/Layout/MainLayout";
import { createImpDate } from "../redux/impDates/impDateActions";
import { FaCalendarAlt } from 'react-icons/fa';

const DateForm = () => {
  const dispatch = useDispatch();
  const impDateLoading = useSelector((state) => state?.impDate?.impDateLoading);
  const user = useSelector((state) => state?.user?.user);

  const [formdata, setFormData] = useState({
    title: "",
    description: "", 
    date: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formdata.title.trim() || !formdata.description.trim() || !formdata.date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await dispatch(createImpDate(formdata));
      toast.success("Date added successfully!");
      // Reset form
      setFormData({
        title: "",
        description: "",
        date: ""
      });
    } catch (error) {
      toast.error("Failed to add date");
    }
  };

  const onChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getFormData());
    dispatch(getNotes());
  }, [dispatch]);

  if (user?.role === 'user') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center">
            <FaCalendarAlt className="mx-auto text-5xl text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-700">Access Denied</h1>
            <p className="mt-2 text-gray-600">You are not authorized to view this page</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <FaCalendarAlt className="mx-auto text-5xl text-blue-500 mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Add Important Dates
              </h2>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={formdata.title}
                    onChange={onChange}
                    name="title"
                    required
                    placeholder="Enter title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={formdata.date}
                    onChange={onChange}
                    name="date"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={formdata.description}
                  onChange={onChange}
                  name="description"
                  rows="6"
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={impDateLoading}
                  className={`flex justify-center items-center py-4 px-8 rounded-lg text-white font-medium text-lg
                    ${impDateLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    } transition duration-200`}
                >
                  {impDateLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Date'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DateForm;
