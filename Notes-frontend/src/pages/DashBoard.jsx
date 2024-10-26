import React, { useEffect, useState } from "react";
import DashLay from "../components/Layout/Dash";
import { motion } from 'framer-motion';
import { fadeIn } from '../Variants';
import Alternates from "../components/Layout/Setting";
import { getUserInfo, getUsersLeaderBoard } from "../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import Lottery from "../components/Lottery";
import SendMoneyCard from "../components/SendMoney";
import Trasnsferhistorycard from "../components/Trasnsferhistorycard";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSendCoinsModalOpen, setIsSendCoinsModalOpen] = useState(false);
  const [istransferhistoryModalOpen, setIstransferhistoryModalOpen] = useState(false);
  const openSendCoinsModal = () => {
    setIsSendCoinsModalOpen(true);
  };

  const closeSendCoinsModal = () => {
    setIsSendCoinsModalOpen(false);
  };

  const opentransferhistorModal = () => {
    setIstransferhistoryModalOpen(true);
  };

  const closetransferhistorModal = () => {
    setIstransferhistoryModalOpen(false);
  };

  const user = useSelector((state) => state.user.user);
  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const userDetailsLoading = useSelector(
    (state) => state.userDetails.userDetailsLoading
  );
  const leaderBoard = useSelector((state) => state.userDetails.leaderBoard);


  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const currentLeaderboardData = leaderBoard?.slice(startIndex, endIndex);

  useEffect(() => {
    if (user) {
      dispatch(getUserInfo(user?.id));
    }
  }, [user]);

  useEffect(() => {
    dispatch(getUsersLeaderBoard());
  }, []);

  return (
    <div>
      {/* <DashLay> */}
      <Alternates >
        <div className="m-10 lg:mr-10 lg:mt-10 lg:m-0 min-h-screen">
          <motion.div initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn('down', 0.3)}>
            {/* send coins , Bookmarked , your notes */}

            <div className="flex-col lg:flex lg:flex-row gap-12 mb-4 ">
              <div class="flex items-center  justify-center lg:w-4/12  w-full h-28 rounded-xl bg-gray-50  mt-2 pl-3">
                <i class="fa-solid fa-ranking-star text-yellow-600 fa-xl"></i>
                <h3 class="text-2xl font-semibold text-gray-900 ml-3">Rank: {userDetails.rank}</h3>
              </div>

              <div class="flex items-center  justify-center lg:w-4/12 w-full h-28 rounded-xl bg-gray-50  mt-2 pl-3">
                <i class="fa-solid fa-cloud-arrow-up fa-xl"></i>
                <h3 class="text-xl font-semibold text-gray-900 ml-3">
                  Notes Uploaded: <p>{userDetails?.notesUploaded}</p>
                </h3>
              </div>

              <div class="flex items-center  justify-center lg:w-4/12 w-full h-28 rounded-xl bg-gray-50  mt-2 pl-3">
                <i class="fa-solid fa-coins fa-xl text-yellow-600"></i>
                <h3 class="text-xl font-semibold text-gray-900 ml-3">
                  Current Coins:<p>{userDetails.coins}</p>{" "}
                </h3>
              </div>

              <div class="flex items-center  justify-center lg:w-4/12 w-full h-28 rounded-xl bg-gray-50  mt-2 pl-3">
                <i class="fa-regular fa-thumbs-up fa-xl fa-fade"></i>
                <h3 class="text-2xl font-semibold text-gray-900 ml-3">
                  Total Likes:{userDetails.totalLikes}
                </h3>
              </div>
            </div>

            <div className="flex justify-center py-3">
              <div className="flex flex-col items-center sm:flex-row mb-5 text-center">
                <div className="relative flex flex-col rounded-xl w-[225px] bg-white bg-clip-border cursor-pointer text-black shadow-md mx-4"
                  onClick={openSendCoinsModal}
                >
                  <div className="p-6">
                    <h5 className=" block font-sans text-xl font-semibold leading-snug tracking-normal text-center">
                    <i class="bi bi-coin mr-1"></i>
                      Send Coins
                    </h5>

                  </div>
                </div>
                {/* </div> */}
                {/* </div> */}

                {/* <div className="flex justify-center py-3"> */}
                {/* <div className="flex flex-col items-center sm:flex-row mb-9 border-2 border-red-800"> */}
                <div className="relative flex flex-col rounded-xl my-4 w-[225px] bg-white bg-clip-border cursor-pointer text-black shadow-md mx-4"
                  onClick={opentransferhistorModal}
                >
                  <div className="p-6">
                    <h5 className=" block font-sans text-xl font-semibold leading-snug tracking-normal">
                    <i class="bi bi-clock-history mr-1"></i>
                      Transfer History
                    </h5>

                  </div>
                </div>

                <div onClick={() => {
                  navigate('/YourNotes')
                }} className="relative flex flex-col rounded-xl mx-4 w-[225px] bg-white bg-clip-border text-black shadow-md">
                  <div className="p-6">
                    <h5 className="m block font-sans text-xl font-semibold leading-snug tracking-normal">
                    <i class="bi bi-archive mr-1"></i>
                      Your Notes
                    </h5>
                  </div>
                </div>

                <div className="relative flex flex-col rounded-xl bg-gray-200 bg-clip-border my-1">
                  <div className="p-6">
                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal">
                      <Lottery />
                    </h5>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
          <div>
            <div>
              <motion.div className="flex flex-col justify-center"
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn('up', 0.3)}>
                {/* Table */}
                <div className="w-full max-w-4xl mx-auto rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                  <header className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h2 className="font-bold text-2xl text-center text-white">
                      Leaderboard
                    </h2>
                  </header>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-sm font-semibold uppercase text-gray-600 bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Rank</div>
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Name</div>
                            </th>
                            <th className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-left">Coins</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {currentLeaderboardData.map((user, index) => {
                            const rank = startIndex + index + 1;
                            return (
                              <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-4 py-3">
                                  <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold
                                    ${rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                                      rank === 2 ? 'bg-gray-100 text-gray-800' :
                                      rank === 3 ? 'bg-orange-100 text-orange-800' : ''}`}>
                                    {rank}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <NavLink 
                                    to={`/profile/${user.username}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition duration-150"
                                  >
                                    {user.username}
                                  </NavLink>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <i className="bi bi-coin text-yellow-500 mr-1"></i>
                                    {user.coins}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex space-x-2">
                          {startIndex > 0 && (
                            <>
                              <button
                                onClick={() => setCurrentPage(1)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                              >
                                First
                              </button>
                              <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                              >
                                Previous
                              </button>
                            </>
                          )}
                        </div>

                        <div>
                          {endIndex < leaderBoard?.length && (
                            <button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                            >
                              Next
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-center mt-4 text-sm text-gray-600">
                        Showing {startIndex + 1} - {Math.min(endIndex, leaderBoard?.length)} of {leaderBoard?.length} results
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>



          <br />
          <br /> <br />
          <br /> <br />
          <br />
          {
            isSendCoinsModalOpen && (
              <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center z-50">
                <div className="modal-container">
                  <div className="modal bg-gray-50 p-8 rounded-lg shadow-lg sm:w-[16rem] md:w-[36rem] lg:w-[52rem]">

                    <button className="modal-close text-right top-4 right-4 text-gray-700" onClick={closeSendCoinsModal}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Send Coins</h2>
                    <div className="modal-body">
                      <SendMoneyCard />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          {
            istransferhistoryModalOpen && (
              <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center z-50">
                <div className="modal-container">
                  <div className="modal bg-gray-50 p-8 rounded-lg shadow-lg sm:w-[16rem] md:w-[36rem] lg:w-[52rem]">

                    <button className="modal-close text-right top-4 right-4 text-gray-700" onClick={closetransferhistorModal}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-center">Transfer Hisory</h2>
                    <h2 className="text-lg font-medium mb-4 text-center">Your Last 5 Transactions</h2>
                    <div className="modal-body">
                      <Trasnsferhistorycard />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </Alternates >
      {/* </DashLay > */}

    </div >
  );
};

export default Dashboard;