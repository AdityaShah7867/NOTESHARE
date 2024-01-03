import React, { useEffect, useState } from "react";
import DashLay from "../components/Layout/Dash";
import { getUserInfo, getUsersLeaderBoard } from "../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import Lottery from "../components/Lottery";
import SendMoneyCard from "../components/SendMoney";
import { NavLink } from "react-router-dom";


const Dashboard = () => {
  const dispatch = useDispatch();
  const [isSendCoinsModalOpen, setIsSendCoinsModalOpen] = useState(false);
  const openSendCoinsModal = () => {
    setIsSendCoinsModalOpen(true);
  };

  const closeSendCoinsModal = () => {
    setIsSendCoinsModalOpen(false);
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
      <DashLay>
        <div>{/* send coins , Bookmarked , your notes */}</div>

        <div className="flex-col lg:flex lg:flex-row gap-12 mb-4">
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
          <div className="flex flex-col items-center sm:flex-row mb-9">
            <div className="relative flex flex-col rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-500 bg-clip-border cursor-pointer text-yellow-900 shadow-md mx-4"
              onClick={openSendCoinsModal}
            >
              <div className="p-6">
                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal">
                  Send Coins
                </h5>

              </div>
            </div>

            <div className="relative flex flex-col rounded-xl bg-gradient-to-r mx-4 my-4 from-green-200 to-green-600 bg-clip-border text-green-900 shadow-md">
              <div className="p-6">
                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal">
                  Your Notes
                </h5>
              </div>
            </div>

            <div className="relative flex flex-col rounded-xl bg-gray-200 bg-clip-border my-4">
              <div className="p-6">
                <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal">
                  <Lottery />
                </h5>
              </div>
            </div>
          </div>

        </div>

        <div>
          <div>
            <div className="flex flex-col justify-center  ">
              {/* Table */}
              <div className="w-full rounded-lg mx-auto bg-slate-100 shadow-lg border border-gray-200">
                <header className="px-5 border-b border-gray-100">
                  <h2 className="font-semibold text-center text-gray-800">
                    LEADERBOARD
                  </h2>
                </header>
                <div className="p-3">
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                      <thead className="text-xs font-semibold uppercase text-gray-400 bg-white">
                        <tr>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-left">Rank</div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-left">Name</div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-left">Coins</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100">
                        {currentLeaderboardData.map((user, index) => {
                          return (
                            <tr key={user.id}>
                              <td>{startIndex + index + 1}</td>
                              <td>
                                <NavLink to={`/profile/${user.username}`} className="cursor:pointer">
                                  {user.username}
                                </NavLink>
                              </td>
                              <td>{user.coins}</td>
                            </tr>
                          );
                        })}
                      </tbody>

                    </table>
                    <div className="items-center flex justify-center">

                      {
                        startIndex === 0 ?
                          null
                          :
                          <>

                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={startIndex === 0}
                              className="mr-2 px-4 py-1 bg-black text-white rounded-md"
                            >
                              First
                            </button>
                            <button
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="mr-2 px-4 py-1 bg-black text-white rounded-md"
                            >
                              Previous
                            </button>
                          </>
                      }


                      {
                        endIndex >= leaderBoard?.length ?
                          null
                          :
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={endIndex >= leaderBoard?.length}
                            className="px-4 py-1 bg-black text-white rounded-md"
                          >
                            Next
                          </button>
                      }

                    </div>
                    <div className="items-center justify-center flex ">
                      {
                        endIndex >= leaderBoard?.length ? (
                          <p className="text-gray-500">Showing {startIndex + 1} - {leaderBoard?.length} of {leaderBoard?.length} results</p>
                        ) : (
                          <p className="text-gray-500">Showing {startIndex + 1} - {endIndex} of {leaderBoard?.length} results</p>
                        )
                      }
                    </div>

                  </div>

                </div>
              </div>
            </div>
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

      </DashLay >

    </div >
  );
};

export default Dashboard;