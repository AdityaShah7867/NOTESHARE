import React, { useState } from "react";
import Alternates from "../components/Layout/Setting";

const Communitychat = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("ALLGROUPS");
    const [searchText, setSearchText] = useState('')


    const openForm = () => {
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
    };

    const handleCancel = () => {
        closeForm();
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <Alternates>
            <div className="m-5">
                <div name="header" className="mx-auto bg-white shadow-md rounded-md p-2 mt-10">
                    <h1 className="font-semibold text-3xl text-center ">Your Communities</h1>
                </div>
                <div name="search bar" className="pt-2 relative mx-auto mt-2 text-gray-600">
                    <input
                        className="border-2 border-gray-300 w-full bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                        type="search"
                        name="search"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                        }
                        }
                        placeholder="Search Communities"
                    />
                    <button type="submit" className="absolute right-0 top-0 mt-5 mr-4"
                    >
                        <svg
                            className="text-gray-600 h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 56.966 56.966"
                            style={{ enableBackground: "new 0 0 56.966 56.966" }}
                            xmlSpace="preserve"
                            width="512px"
                            height="512px"
                        >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
                <div name="options" className="flex justify-between items-center mt-4 gap-4 mx-auto">
                    <p
                        className={`border border-gray-300 w-full text-center rounded-lg p-2 hover:cursor-pointer ${activeTab === 'ALLGROUPS' ? 'text-white bg-blue-600' : ''}`}
                        onClick={() => handleTabClick('ALLGROUPS')}
                    >
                        All Communities
                    </p>
                    <p
                        className={`border border-gray-300 text-black  w-full text-center rounded-lg p-2 hover:cursor-pointer ${activeTab === 'JOINED' ? 'text-white bg-blue-600' : ''}`}
                        onClick={() => handleTabClick('JOINED')}
                    >
                        Joined
                    </p>
                </div>
                <div>
                    <div name="community list" className="flex flex-col gap-4 mt-4 mx-auto rounded-2xl bg-white">
                        <div className="flex justify-between items-center bg-white shadow-md rounded-md p-2">
                            <div className="flex gap-4 items-center">
                                <img
                                    src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                                    alt="community"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="">
                                    <h1 className="font-semibold text-lg">Community Name</h1>
                                    <p className="text-sm">Admin:</p>
                                    <p className="text-sm">Description:</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>






                <div name="bottom circle" class="fixed bottom-32 right-8 z-80">
                    <button
                        title="Add New"
                        onClick={openForm}
                        class="group cursor-pointer hover:rotate-90  active:scale-100 duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="70px"
                            height="70px"
                            viewBox="0 0 24 24"
                            class="stroke-slate-200 fill-blue-800 group-active:fill-blue-600 duration-200"
                        >
                            <path
                                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                                stroke-width=""
                            ></path>
                            <path d="M8 12H16" stroke-width="1.5"></path>
                            <path d="M12 16V8" stroke-width="1.5"></path>
                        </svg>
                    </button>
                </div>
                {isFormVisible && (
                    <div className="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50 z-50">
                        <div className="mx-auto p-4 bg-white shadow-md rounded-md w-4/5">
                            <h2 className="text-lg font-semibold mb-4">Create Community</h2>

                            <form
                            // onSubmit={handleSave}
                            >
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="groupName"
                                        id="GrpName"
                                        // value={groupName}
                                        // onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none  peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_email"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        GROUP NAME
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="bio"
                                        id="floating_text"
                                        // value={bio}
                                        // onChange={handleChange}
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none  peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="floating_text"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        BIO
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

        </Alternates>
    )
}

export default Communitychat