import React from 'react'
import { FaCalendarAlt, FaClock } from 'react-icons/fa'

function formatDateTimeInIST(date) {
    const istDate = new Date(date);
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const istDateTime = istDate.toLocaleDateString('en-IN', options);
    return istDateTime;
}

const ImpDatesCard = ({ imp }) => {
    return (
        <div className="w-full p-4">
            <div className="max-w-md mx-auto transform transition duration-300 hover:scale-105">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white tracking-wide">
                            {imp?.title}
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <FaCalendarAlt className="text-blue-500 mr-2" />
                            <p className="text-gray-600 font-medium">
                                {formatDateTimeInIST(imp?.date)}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">
                                {imp?.description}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1" />
                            <span>Added {new Date(imp?.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImpDatesCard