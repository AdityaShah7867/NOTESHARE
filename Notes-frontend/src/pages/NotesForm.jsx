import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFormData, addNote } from "../redux/notes/noteActions";
import { getNotes } from "../redux/notes/noteActions";
import { toast } from "react-toastify";
import Alternates from "../components/Layout/MainLayout"

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
    year:0
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };
  const maxDescLength = 20;

  const handleDescChange = (e) => {
    if (e.target.value.length <= maxDescLength) {
      onChange(e);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (formdata.name.length < 10) {
      toast.error("Name must be at least 10 characters long");
      return;
    }
    if (formdata.desc.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (!formdata.subject) {
      toast.error("Please select a subject");
      return;
    }

    if (!formdata.module) {
      toast.error("Please select a module");
      return;
    }

    if (!formdata.type) {
      toast.error("Please select a type");
      return;
    }

    if (!formdata.file) {
      toast.error("Please upload a file");
      return;
    }


    console.log(formdata)
    await dispatch(addNote(formdata));
    // setFormdata({
    //   name: "",
    //   subject: "",
    //   module: "",
    //   type: "",
    //   desc: "",
    //   branch: "",
    //   file: null,
    //   year:0
    // });
    await dispatch(getNotes());
  };



  useEffect(() => {
    dispatch(getFormData());
    dispatch(getNotes());
  }, [dispatch]);

  return (
    <Alternates>
      <div className=" flex items-center justify-center  px-4 py-12 sm:px-6 lg:px-8 bg-no-repeat bg-cover relative h-screen">
        <div className="w-full pt-4 bg-white z-10">
          <div className="text-center">
            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Add Notes & Contribute to the Community!!
            </h2>
          </div>
          <form className="mt-8 space-y-3" onSubmit={handlesubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Name
                <input
                  type="text"
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.name}
                  placeholder="Name the note.."
                  onChange={onChange}
                  name="name"
                  required
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Subject
                <select
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
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
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
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
            {/* branch */}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Branch
                <select
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.branch}
                  onChange={onChange}
                  name="branch"
                  required
                >
                  <option value="">Select Branch</option>

                  {
                   branches?.map((branch)=>(
                    <option  key={branch.id} value={branch._id}  >{branch.name}</option>
                   ))
                  }
               
                </select>
              </label>
            </div>

            {/* year */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Year
                <select
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.year}
                  onChange={onChange}
                  name="year"
                  required
                >
                  <option value="">Select Module</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
            </div>


            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Type
                <select
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
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
            <div className="w-full space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Desc:
                <input
                  type="text"
                  className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={formdata.desc}
                  onChange={handleDescChange}
                  name="desc"
                  maxLength={maxDescLength}
                  required
                />
                <span className="text-gray-400 text-sm">
                  {formdata.desc.length}/{maxDescLength}
                </span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-500 tracking-wide">
                Attach Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-40 p-10 group text-center bg-gray-100 hover:bg-gray-200 transition-colors">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    <div className="flex flex-auto max-h-1 w-2/5 mx-auto -mt-10"></div>
                    {formdata.file ? (
                      <div className="text-center p-5">
                        <p className="text-xl text-gray-600 font-semibold">
                          File Name:
                        </p>
                        <p className="text-gray-800 text-2xl font-bold">
                          {formdata.file.name}
                        </p>
                      </div>
                    ) : (
                      <label className="pointer-none text-gray-600 pt-7 cursor-pointer">
                        <span className="text-sm">Drag and drop</span> files here
                        <br /> or{" "}
                        <span className="text-blue-600 hover:underline">
                          select a file
                          <input
                            type="file"
                            name="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </span>{" "}
                        from your computer
                      </label>
                    )}
                  </div>
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              <span>File type: pdf</span>
            </p>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-gray-100 p-4 rounded-full font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                {noteAddLoading ? "Loading..." : "Submit Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Alternates>

  );
};

export default NotesForm;