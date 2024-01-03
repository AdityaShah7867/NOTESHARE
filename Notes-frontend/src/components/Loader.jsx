import React from 'react'

const Loader = () => {
    return (
        <div>
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
                <p className="text-white text-2xl ml-4">Loading...</p>
            </div>
        </div>
    )
}

export default Loader