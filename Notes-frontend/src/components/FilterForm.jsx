import React, { useEffect, useState } from 'react'
import { getFilteredFormData } from '../redux/notes/noteActions'
import { useDispatch, useSelector } from 'react-redux'
import { modules } from '../constants/constants'
import axios from 'axios'
import { filterdNotes } from '../redux/notes/noteActions'

const FilterForm = ({ closeFilterModal, isFilterModalOpen }) => {
    const dispatch = useDispatch();
    const [filterFormData, setFilterFormData] = useState({
        branch: '',
        subject: '',
        module: '',
        type: ''
    })

    const { FilterdFormData } = useSelector((state) => state?.note) || []

    const filterdSubject = FilterdFormData?.subject?.filter((subject) => subject?.branch?.name === filterFormData.branch);

    const handleFilter = async (e) => {
        e.preventDefault()
        console.log(filterFormData)

        const { branch, subject, module, type } = filterFormData;
        const queryString = `?branch=${branch}&subject=${subject}&module=${module}&type=${type}`;

        http://localhost:4000/api/v1/notes/filterNote?type=Assignment?branch=&subject=&module=&type=Assignment

        dispatch(filterdNotes(queryString))


        closeFilterModal()
    }



    const onChange = (e) => {
        setFilterFormData({
            ...filterFormData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        dispatch(getFilteredFormData())

    }, [dispatch])

    const type = ["Assignment", "Notes", "Question Paper", "Syllabus", "Other"];


    return (
        <div>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="fixed inset-0 transition-opacity"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <div
                        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                            <div className="mb-4">
                                <label
                                    htmlFor="module"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    BRANCH
                                </label>
                                <select
                                    onChange={
                                        onChange
                                    }
                                    id="module"
                                    name='branch'
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select branch</option>
                                    {
                                        FilterdFormData?.branches?.map((branch, index) => (
                                            <option key={index} value={branch.name}>{branch.name}</option>
                                        ))

                                    }

                                </select>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="module"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Subject
                                </label>
                                <select
                                    id="module"
                                    onChange={onChange}
                                    name='module'
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                >
                                    {
                                        filterFormData.branch === '' ? (
                                            <option value="">Select branch to load subjects </option>
                                        ) : <option value="">Select Subject</option>
                                    }

                                    {
                                        filterFormData.branch !== '' && (
                                            <>
                                                {filterdSubject.length !== 0 ? (
                                                    filterdSubject?.map((subject) => (
                                                        <option value={subject.name}>{subject.name}</option>
                                                    ))

                                                )
                                                    : (
                                                        <option value="">No Subject Found</option>
                                                    )

                                                }
                                            </>
                                        )



                                    }
                                </select>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="subject"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Module
                                </label>
                                <select
                                    id="subject"
                                    onChange={onChange}
                                    name='subject'
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select Module</option>
                                    {
                                        filterFormData.branch !== '' && (
                                            <>
                                                {
                                                    modules.map((module) => (
                                                        <option value={module}>{module}</option>
                                                    ))
                                                }
                                            </>
                                        )
                                    }


                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="type"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Type
                                </label>
                                <select
                                    id="type"
                                    onChange={onChange}
                                    name='type'
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="">Select Type</option>
                                    {
                                        type.map((type) => (
                                            <option value={type}>{type}</option>
                                        ))
                                    }

                                </select>
                            </div>
                            <div className="mt-3 text-center sm:mt-0">
                                <button
                                    onClick={handleFilter}
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Filter
                                </button>
                                <button
                                    onClick={closeFilterModal}
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterForm