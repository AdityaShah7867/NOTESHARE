import React from 'react'

const BoostPageLayout = ({ children }) => {
    return (
        <div className="flex-grow bg-gray-900 -mt-12 min-h-screen">
            <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-full lg:ml-96 sm:p-2 transition-all duration-300">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default BoostPageLayout