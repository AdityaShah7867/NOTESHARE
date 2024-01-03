import React from 'react'
function formatDateTimeInIST(date) {
    const istDate = new Date(date);
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: true, // Set to true if you want 12-hour format
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long', // Full day of the week
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const istDateTime = istDate.toLocaleDateString('en-IN', options);

    return istDateTime;
}


const ImpDatesCard = ({ imp }) => {
    return (
        <div>
            
            <div className="w-full p-4 ">
                <div className='-mt-4'>
                    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-sm md:max-w-2xl mt-1  p-6">
                        <div className="font-semibold text-xl mb-2">{imp?.title}</div>
                        <p className="text-gray-700 text-base">
                            {imp?.description}
                        </p>
                        <p className="text-gray-700 text-base mt-2">
                            {formatDateTimeInIST(imp?.date)}

                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ImpDatesCard