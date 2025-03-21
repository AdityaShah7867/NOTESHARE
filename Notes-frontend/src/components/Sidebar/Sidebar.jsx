import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader";
import { seachUser } from "../../redux/user/userActions";
import { getUserProfile } from "../../redux/user/userActions";
import { getLogedinUser } from "../../redux/auth/authActions";
import { useNavigate, useLocation } from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const searchedUser = useSelector((state) => state?.userDetails?.searchedUser);

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    window.location.reload();
  };

  const handleSearchBlur = () => {
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

  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "hover:bg-gray-700/50";

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="sideParent">
        <div className="sidebar fixed top-0 bottom-0 lg:left-0 w-[280px] overflow-y-auto text-white bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl transition-all duration-300 ease-in-out">
          {/* User Profile Section */}
          <div className="p-3 mb-2">
            <div className="flex items-center space-x-3 bg-gray-800/60 p-3 rounded-lg transition duration-300 hover:bg-gray-700/60">
              <img
                src={`${process.env.REACT_APP_API_HOST}/`+user?.profile}
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md transition hover:scale-105"
                alt={user?.username}
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-100">{user?.username}</span>
                <div className="flex items-center mt-1">
                  <div className="flex items-center bg-gradient-to-r from-yellow-500 to-amber-600 px-2.5 py-1 rounded-full shadow">
                    <i className="fa-solid fa-coins text-yellow-200 mr-1.5 text-xs"></i>
                    <span className="text-xs font-bold tracking-wide text-white">{user?.coins}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="px-3 mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400 text-xs"></i>
              </div>
              <input
                type="text"
                placeholder="Find people"
                name="username"
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-gray-700/50 text-xs border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white transition-all duration-200"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Search Results */}
          {username.length > 0 && searchedUser?.map((user) => (
            <NavLink key={user?.username} to={`/profile/${user?.username}`}>
              <div className="mx-3 p-2 flex items-center rounded-md transition-all duration-200 hover:bg-gray-700 cursor-pointer">
                <img
                  src={user?.profile}
                  alt=""
                  className="w-8 h-8 rounded-full border border-blue-400"
                />
                <span className="ml-3 text-xs font-medium text-gray-200">{user?.username}</span>
              </div>
            </NavLink>
          ))}

          <div className="px-3 py-1">
            <div className="h-px bg-gray-700/50 mb-2"></div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-1 space-y-1">
            <NavLink to="/home" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-house-door text-sm"></i>
              <span className="font-medium text-xs">Home</span>
            </NavLink>

            <NavLink to="/dashboard" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-clipboard-data text-sm"></i>
              <span className="font-medium text-xs">Dashboard</span>
            </NavLink>

            <NavLink to="/notification" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-bell text-sm"></i>
              <span className="font-medium text-xs">Important Dates</span>
            </NavLink>

            <NavLink to="/leetcode" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-code-slash text-sm"></i>
              <span className="font-medium text-xs">DSA Questions</span>
            </NavLink>

            <NavLink to="/addnotes" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-file-earmark-plus text-sm"></i>
              <span className="font-medium text-xs">Add Notes</span>
            </NavLink>

            <NavLink to="/communities" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-people text-sm"></i>
              <span className="font-medium text-xs">Communities</span>
            </NavLink>

            <NavLink to="/video" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-camera-video text-sm"></i>
              <span className="font-medium text-xs">Video Room</span>
            </NavLink>

            <NavLink to="/books" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-book text-sm"></i>
              <span className="font-medium text-xs">Book Library</span>
            </NavLink>

            <NavLink to="/gameslist" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-joystick text-sm"></i>
              <span className="font-medium text-xs">Games</span>
            </NavLink>

            <NavLink to="/resumeReview" className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-file-earmark-person text-sm"></i>
              <span className="font-medium text-xs">Resume Review</span>
            </NavLink>
          </div>

          <div className="px-3 py-1">
            <div className="h-px bg-gray-700/50 my-2"></div>
          </div>

          {/* Profile & Admin Section */}
          <div className="px-3 py-1 space-y-1">
            <NavLink to={`/profile/${user?.username}`} className={({ isActive }) => 
              `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
            }>
              <i className="bi bi-person-circle text-sm"></i>
              <span className="font-medium text-xs">Profile</span>
            </NavLink>

            {user?.role === "superuser" && (
              <>
                <NavLink to="/admin" className={({ isActive }) => 
                  `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
                }>
                  <i className="bi bi-person-fill-gear text-sm"></i>
                  <span className="font-medium text-xs">Admin</span>
                </NavLink>

                <NavLink to="/dateform" className={({ isActive }) => 
                  `flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
                }>
                  <i className="bi bi-clipboard text-sm"></i>
                  <span className="font-medium text-xs">Dates</span>
                </NavLink>
              </>
            )}

            <div 
              className="flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-700/50 cursor-pointer"
              onClick={() => navigate("/otp")}
            >
              <i className="bi bi-gear-wide-connected text-sm"></i>
              <span className="font-medium text-xs">Reset Password</span>
            </div>

            <div 
              className="flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 hover:bg-red-500/20 cursor-pointer"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-in-right text-sm"></i>
              <span className="font-medium text-xs">Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="MobileBtm">
        <div className="w-full fixed inset-x-0 bottom-0 z-10 bg-white shadow-lg border-t">
          <div className="flex justify-around items-center">
            <NavLink to="/home" className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" 
                  fill="currentColor"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </NavLink>

            <NavLink to="/video" className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 9V15M6.5 12H12.5M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">Video</span>
            </NavLink>

            <NavLink to="/addnotes" className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">Add</span>
            </NavLink>

            <NavLink to="/dashboard" className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="M746.667 106.667H1173.33V1493.33H746.667V106.667ZM533.333 533.333H106.667V1493.33H533.333V533.333ZM1920 1706.67H0V1824H1920V1706.67ZM1813.33 746.667H1386.67V1493.33H1813.33V746.667Z"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">Dashboard</span>
            </NavLink>

            <NavLink to={`/profile/${user?.username}`} className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.5" cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path opacity="0.5" d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">Profile</span>
            </NavLink>

            <NavLink to="/notification" className={({ isActive }) => 
              `flex flex-col items-center py-2 px-2 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }>
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.866 15.509L16.886 16.489L15.906 15.511L13.949 13.554L14.926 12.577L16.883 14.534L21.774 9.64L22.754 10.617L17.866 15.509Z" fill={`${location.pathname === "/notification" ? "green" : "currentColor"}`}/>
                <rect x="14.454" y="21.443" width="8.303" height="1.383" fill={`${location.pathname === "/notification" ? "#c00000" : "currentColor"}`}/>
                <path d="M2 5.74V29.449H26.909V5.74ZM25.477 28.189L3.394 28.131L3.417 7.157H25.494ZM6.151 10.951V16.485H11.685V10.951ZM10.3 15.1H7.534V12.334H10.3ZM6.149 19.323V24.857H11.683V19.323ZM10.3 23.474H7.534V20.709H10.3ZM30 2.551V26.24H28.569L28.549 4L6.149 3.971V2.551H30Z" fill="currentColor"/>
              </svg>
              <span className="text-[10px] mt-1 font-medium">To-Do</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
