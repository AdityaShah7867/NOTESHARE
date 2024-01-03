import React from 'react'

const ChatLay = ({ children }) => {
    return (
        <div className="flex-grow bg-white -mt-12 sm:-ml-2 md:-ml-2 lg:-ml-20 ">
            <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-full lg:ml-96 sm:p-2 " >

                    {children}
                </div>
            </div>
        </div>

    )
}

export default ChatLay