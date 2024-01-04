import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormData, addNote } from "../redux/notes/noteActions";
import { getNotes } from "../redux/notes/noteActions";
import { toast } from "react-toastify";
import Alternates from "../components/Layout/MainLayout"
import { createImpDate } from "../redux/impDates/impDateActions";
import MainLayout from "../components/Layout/MainLayout";

const NotesForm = () => {
  const dispatch = useDispatch();
  const impDateLoading = useSelector((state) => state?.impDate?.impDateLoading)
  const user = useSelector((state) => state?.user?.user)

  const [formdata, setFormData] = useState({
    title: "",
    description: "",
    date: ""
  })

  const handlesubmit = (e) => {
    e.preventDefault();


    dispatch(createImpDate(formdata))
  }

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
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-gray-700">You are not authorized to view this page</h1>
        </div>
      </MainLayout>
    )

  }

  return (
    <Alternates>
      <div className="relative min-h-screen flex  items-center justify-center  py-12 px-4 sm:px-6 lg:px-8  bg-no-repeat bg-cover relative items-center">
        <div className="absolute g w-full p-10 bg-white  z-10">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              Add Reminder and important Dates!
            </h2>
          </div>
          <form className="mt-8 space-y-3" onSubmit={handlesubmit}>

            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Title

                <input
                  type="text"
                  className="text-base w-3/4 p-2 ml-16 border-x border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.title}
                  onChange={onChange}
                  name="title"
                  required
                  placeholder="Title..."
                />
              </label>
            </div>





            <div className="  w-full space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Desc:
                <input
                  type="text"
                  className="text-base w-3/4 p-2 ml-16 border-x border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.description}
                  onChange={onChange}
                  name="description"
                  placeholder="description..."
                  required
                />

              </label>

            </div>

            <div className="  w-full space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Date:
                <input
                  type="date"
                  className="text-base w-3/4 p-2 ml-16 border-x border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.date}
                  onChange={onChange}
                  name="date"
                  placeholder="date..."
                  required
                />

              </label>

            </div>




            <div>
              <button
                type="submit"
                className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                {
                  impDateLoading ? <h1>Adding...</h1> : <h1>Add</h1>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </Alternates>
  );
};

export default NotesForm;
