import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader";
import { seachUser } from "../../redux/user/userActions";
import { getUserProfile } from "../../redux/user/userActions";
import { getLogedinUser } from "../../redux/auth/authActions";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState("");
  const location = useLocation();

  const searchedUser = useSelector((state) => state?.userDetails?.searchedUser);

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    window.location.reload();
  };

  const handleSearchBlur = () => {
    console.log(username);
    setUsername("");
  };

  useEffect(() => {
    if (username !== "") {
      dispatch(seachUser(username));
      dispatch(getUserProfile(username));
    }
  }, [dispatch, username]);

  useEffect(() => {
    dispatch(getLogedinUser());
  }, [dispatch]);

  return (
    <div>
      <div className="sideParent">
        <span
          className="absolute text-white text-4xl top-5 left-4 cursor-pointer"
          onclick="openSidebar()"
        >
          <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md" />
        </span>
        <div className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[275px] overflow-y-auto text-center bg-gray-900">
          <div className="text-gray-100 text-xl">
            <div className="p-2.5 mt-1 flex items-center">
              <img
                src={user?.profile}
                className="w-[40px] h-[40px] rounded-full border"
              />
              <h1 className="font-bold text-gray-200 text-[15px] ml-3">
                <div className="flex-col">
                  <p>
                    {" "}
                    {user?.username} &nbsp;{" "}
                    <i className="fa-solid fa-coins fa-xl text-yellow-600"></i>
                    &nbsp; &nbsp;
                    {user?.coins}
                  </p>
                </div>
              </h1>
            </div>
            <div className="my-2 bg-gray-600 h-[1px]" />
          </div>
          <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white">
            <i className="bi bi-search text-sm" />
            <input
              type="text"
              placeholder="Find people"
              name="username"
              className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleSearchBlur}
            />
          </div>
          <div className="my-2 bg-gray-600 h-[1px]" />
          {searchedUser?.map((user) => (
            <NavLink to={`/profile/${user?.username}`}>
              <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                <img
                  src={user?.profile}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full border border-blue-400"
                />
                <span className="text-[15px] ml-4 text-gray-200 font-bold">
                  {user?.username}
                </span>
              </div>
            </NavLink>
          ))}

          <NavLink to={"/home"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/home" ? "bg-blue-500" : ""
                } text-white`}
            >
              <i className="bi bi-house-door"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Home
              </span>
            </div>
          </NavLink>

          <NavLink to={"/notification"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/notification" ? "bg-blue-500" : ""
                }`}
            >
              <i className="bi bi-bell text-white"></i>
              <span className="text-[15px] ml-4 font-bold text-gray-200">
                Important Dates
              </span>
            </div>
          </NavLink>

          <NavLink to={"/addnotes"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/addnotes" ? "bg-blue-500" : ""
                }`}
            >
              <i className="bi bi-file-earmark-plus text-white"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Add notes
              </span>
            </div>
          </NavLink>

          <NavLink to={"/communities"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/communities" ? "bg-blue-500" : ""
                }`}
            >
              <i className="bi bi-people text-white"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Communities
              </span>
            </div>
          </NavLink>

          <NavLink to={"/video"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/video" ? "bg-blue-500" : ""
                }`}
            >
              <i className="bi bi-camera-video text-white"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Video Room
              </span>
            </div>
          </NavLink>

          <NavLink to={"/dashboard"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/dashboard" ? "bg-blue-500" : ""
                }`}
            >
              <i className="bi bi-clipboard-data text-white"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Dashboard
              </span>
            </div>
          </NavLink>
          <NavLink to={`/profile/${user?.username}`}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === `/profile/${user?.username}`
                ? "bg-blue-500"
                : ""
                }`}
            >
              <i className="bi bi-person-circle text-white"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Profile
              </span>
            </div>
          </NavLink>

          <NavLink to={"/communities"}>
            <div
              className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 ${location.pathname === "/communities" ? "bg-blue-500" : ""
                }`}
            >
              <i class="bi bi-gear"></i>
              <span className="text-[15px] ml-4 text-gray-200 font-bold">
                Communities
              </span>
            </div>
          </NavLink>

          {user?.role == "superuser" && (
            <>
              <NavLink to={"/admin"}>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                <i className="bi bi-person-fill-gear text-white"></i>
                  <span className="text-[15px] ml-4 text-gray-200 font-bold">
                    Admin
                  </span>
                </div>
              </NavLink>

              <NavLink to={"/dateform"}>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                <i className="bi bi-clipboard text-white"></i>
                  <span className="text-[15px] ml-4 text-gray-200 font-bold">
                    Dates
                  </span>
                </div>
              </NavLink>
            </>
          )}

          <div className="my-4 bg-gray-600 h-[1px]" />

          <div
            className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
            onClick={() => {
              navigate("/otp");
            }}
          >
            <i className="bi bi-gear-wide-connected text-white"></i>
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Reset Password
            </span>
          </div>
          <div
            className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
            onClick={() => {
              handleLogout();
            }}
          >
            <i className="bi bi-box-arrow-in-right" />
            <span className="text-[15px] ml-4 text-gray-200 font-bold">
              Logout
            </span>
          </div>
        </div>
      </div>

      <div className="MobileBtm">
        {/* component */}
        <div className="w-full">
          <section
            id="bottom-navigation"
            className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow"
          >
            <div id="tabs" className="flex justify-between mx-5">
              <NavLink to={"/home"}>
                <div className="w-full focus:text-teal-500 hover:text-teal-500  justify-center inline-block text-center pt-2 pb-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z"
                        fill="#080341"
                      ></path>{" "}
                    </g>
                  </svg>
                  <span className="tab tab-home block text-xs ">Home</span>
                </div>
              </NavLink>

              <NavLink to={"/video"}>
                <a
                  href="#"
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M9.5 9V15M6.5 12H12.5M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                  <span className="tab tab-kategori block  text-xs">Video</span>
                </a>
              </NavLink>

              <NavLink to={"/addnotes"}>
                <a
                  href="#"
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    width="32px"
                    height="32px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      ></circle>{" "}
                      <path
                        d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>{" "}
                    </g>
                  </svg>{" "}
                  <span className="tab tab-explore block text-xs">ADD</span>
                </a>
              </NavLink>

              <NavLink to={"/dashboard"}>
                <a
                  href="#"
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
                >
                  <center>
                    <svg
                      fill="#000000"
                      width="30px"
                      height="30px"
                      viewBox="0 0 1920 1920"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path d="M746.667 106.667H1173.33V1493.33H746.667V106.667ZM533.333 533.333H106.667V1493.33H533.333V533.333ZM1920 1706.67H0V1824H1920V1706.67ZM1813.33 746.667H1386.67V1493.33H1813.33V746.667Z"></path>{" "}
                      </g>
                    </svg>
                  </center>

                  <span className="tab tab-whishlist block text-xs mt-1">
                    DASHBOAR0D
                  </span>
                </a>
              </NavLink>

              <NavLink to={`/profile/${user?.username}`}>
                <a
                  href="#"
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    width="32px"
                    height="32px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <circle
                        opacity="0.5"
                        cx="12"
                        cy="9"
                        r="3"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      ></circle>{" "}
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      ></circle>{" "}
                      <path
                        opacity="0.5"
                        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      ></path>{" "}
                    </g>
                  </svg>
                  <span className="tab tab-account block text-xs mt-1">
                    Profile
                  </span>
                </a>
              </NavLink>

              {/* New Submission Button */}
              <NavLink to={"/notification"}>
                <a
                  href="#"
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>file_type_light_todo</title>
                      <polygon
                        points="17.866 15.509 17.866 15.509 16.886 16.489 15.906 15.511 15.906 15.511 13.949 13.554 14.926 12.577 16.883 14.534 21.774 9.64 22.754 10.617 17.866 15.509"
                        style={{ fill: "green" }}
                      ></polygon>
                      <rect
                        x="14.454"
                        y="21.443"
                        width="8.303"
                        height="1.383"
                        style={{ fill: "$c00000" }}
                      ></rect>
                      <path d="M2,5.74V29.449H26.909V5.74ZM25.477,28.189,3.394,28.131,3.417,7.157H25.494ZM6.151,10.951v5.534h5.534V10.951ZM10.3,15.1H7.534V12.334H10.3Zm-4.151,4.22v5.534h5.534V19.323ZM10.3,23.474H7.534V20.709H10.3ZM30,2.551V26.24H28.569L28.549,4l-22.4-.029V2.551H30Z"></path>
                    </g>
                  </svg>
                  <span className="tab tab-submission block text-xs mt-1">
                    To-Do
                  </span>
                </a>
              </NavLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
