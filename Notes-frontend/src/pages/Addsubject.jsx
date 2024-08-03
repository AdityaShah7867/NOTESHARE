import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Setting";
import { toast } from "react-toastify";
import axios from "axios";

const url = process.env.REACT_APP_API_HOST;
const authToken = localStorage.getItem('authtoken');


const Addsubject = () => {

    const subjectAddLoading = useState(false)
    const Sem = [1, 2, 3, 4, 5, 6, 7, 8];
    const Department = [
        "CSE",
        "IT",
        "CSEDS",
        "AIDS",
        "EXTC",
        "MECH",
    ];
    const [formdata, setFormdata] = useState({
        name: "",
        Sem: "",
        Department: "",
        file: null,
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

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formdata.name) {
                toast.error("Name must be at least 10 characters long");
                return;
            }

            if (!formdata.Department) {
                toast.error("Please select a Department");
                return;
            }

            if (!formdata.Sem) {
                toast.error("Please select a Semester");
                return;
            }

            if (!formdata.file) {
                toast.error("Please upload a file");
                return;
            }

            const { name, Department, Sem, file } = formdata;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("branch", Department);
            formData.append("sem", Sem);
            formData.append("file", file);
            const res = await axios.post(`${url}/api/v1/sub`, {
                name: name,
                branch: Department,
                sem: Sem,
                Image: file
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },

            })
            if (res.status === 201) {
                toast.success("Subject Added Successfully");
                setFormdata({
                    name: "",
                    Department: "",
                    Sem: "",
                    file: null,
                });
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <Alternates>
            <div className='bg-white h-screen px-8 py-12 lg:-mx-28'>
                <div className='flex justify-center items-center h-full'>
                    <form className="mt-8 space-y-3 w-1/2" onSubmit={handlesubmit}>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-500 tracking-wide">
                                Subject Name
                                <input
                                    type="text"
                                    className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                    value={formdata.name}
                                    placeholder="Name of the Subject.."
                                    onChange={onChange}
                                    name="name"
                                    required
                                />
                            </label>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-500 tracking-wide">
                                Department
                                <select
                                    className="text-base w-full p-2  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                    value={formdata.Department}
                                    onChange={onChange}
                                    name="Department"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {Department?.map((data, index) => (
                                        <option key={index} value={data} className="text-black">
                                            {data}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-500 tracking-wide">
                                Semester
                                <select
                                    className="text-base w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                    value={formdata.Sem}
                                    onChange={onChange}
                                    name="Sem"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {Sem.map((data, index) => (
                                        <option key={index} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-500 tracking-wide">
                                Give Cover Image
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
                                                    <input
                                                        type="file"
                                                        name="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
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
                            <span>File type: image</span>
                        </p>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-gray-100 p-4 rounded-full font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                            >
                                {subjectAddLoading ? "Add Subject" : "Loading..."}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Alternates>
    )
}

export default Addsubject