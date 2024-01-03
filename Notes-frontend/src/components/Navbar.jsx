import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userRole = useSelector((state) => state?.user?.user?.role);

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Home", link: "/" },
    { label: "Notes", link: "/" },
    { label: "Dashboard", link: "/dashboard" },
    { label: "AddNotes", link: "/addnotes" },
    { label: "Profile", link: "/profile" },

    { label: "Admin", link: "/admin" },
    { label: "Video", link: "/Video" },

  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border border-gray-800 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a className="flex items-center">
            <NavLink
              to={"/"}
              className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >
              NotesBeta
            </NavLink>
          </a>
          <div className="flex md:order-2">
            <button
              type="button"
              onClick={handleLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${isMenuOpen ? "block" : "hidden"
              } items-center justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navItems.map((item, index) => (
                (item.link === "/notestable" && userRole !== "superuser") ? null : (
                  <li key={index}>
                    <NavLink
                      to={item.link}
                      className="block py-2 pl-3 pr-4 text-gray-900 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      aria-current="page"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>
        <hr className="text-white" />
      </nav>

      <section
        id="bottom-navigation"
        className="block fixed inset-x-0 bottom-0 z-10 mt-5 bg-white shadow"
      >
        <div id="tabs" className="flex justify-between mx-5 mbtn">
          <NavLink to={'/'}>
            <div

              className="w-full focus:text-teal-500 hover:text-teal-500  justify-center inline-block text-center pt-2 pb-1"
            >
              <svg
                width={25}
                height={25}
                viewBox="0 0 42 42"
                className="inline-block mb-1"
              >
                <g
                  stroke="none"
                  strokeWidth={1}
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    d="M21.0847458,3.38674884 C17.8305085,7.08474576 17.8305085,10.7827427 21.0847458,14.4807396 C24.3389831,18.1787365 24.3389831,22.5701079 21.0847458,27.6548536 L21.0847458,42 L8.06779661,41.3066256 L6,38.5331279 L6,26.2681048 L6,17.2542373 L8.88135593,12.4006163 L21.0847458,2 L21.0847458,3.38674884 Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M11,8 L33,8 L11,8 Z M39,17 L39,36 C39,39.3137085 36.3137085,42 33,42 L11,42 C7.6862915,42 5,39.3137085 5,36 L5,17 L7,17 L7,36 C7,38.209139 8.790861,40 11,40 L33,40 C35.209139,40 37,38.209139 37,36 L37,17 L39,17 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M22,27 C25.3137085,27 28,29.6862915 28,33 L28,41 L16,41 L16,33 C16,29.6862915 18.6862915,27 22,27 Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <rect
                    fill="currentColor"
                    transform="translate(32.000000, 11.313708) scale(-1, 1) rotate(-45.000000) translate(-32.000000, -11.313708) "
                    x={17}
                    y="10.3137085"
                    width={30}
                    height={2}
                    rx={1}
                  />
                  <rect
                    fill="currentColor"
                    transform="translate(12.000000, 11.313708) rotate(-45.000000) translate(-12.000000, -11.313708) "
                    x={-3}
                    y="10.3137085"
                    width={30}
                    height={2}
                    rx={1}
                  />
                </g>
              </svg>
              <span className="tab tab-home block text-xs">Home</span>
            </div>
          </NavLink>

          <NavLink to={'/chat'}>
            <a
              href="#"
              className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
            >
              <svg
                width={25}
                height={25}
                viewBox="0 0 42 42"
                className="inline-block mb-1"
              >
                <g
                  stroke="none"
                  strokeWidth={1}
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    d="M14.7118754,20.0876892 L8.03575361,20.0876892 C5.82661462,20.0876892 4.03575361,18.2968282 4.03575361,16.0876892 L4.03575361,12.031922 C4.03575361,8.1480343 6.79157254,4.90780265 10.4544842,4.15995321 C8.87553278,8.5612583 8.1226025,14.3600511 10.9452499,15.5413938 C13.710306,16.6986332 14.5947501,18.3118357 14.7118754,20.0876892 Z M14.2420017,23.8186831 C13.515543,27.1052019 12.7414284,30.2811559 18.0438552,31.7330419 L18.0438552,33.4450645 C18.0438552,35.6542035 16.2529942,37.4450645 14.0438552,37.4450645 L9.90612103,37.4450645 C6.14196811,37.4450645 3.09051926,34.3936157 3.09051926,30.6294627 L3.09051926,27.813861 C3.09051926,25.604722 4.88138026,23.813861 7.09051926,23.813861 L14.0438552,23.813861 C14.1102948,23.813861 14.1763561,23.8154808 14.2420017,23.8186831 Z M20.7553776,32.160536 C23.9336213,32.1190063 23.9061943,29.4103976 33.8698747,31.1666916 C34.7935223,31.3295026 35.9925894,31.0627305 37.3154077,30.4407183 C37.09778,34.8980343 33.4149547,38.4450645 28.9036761,38.4450645 C24.9909035,38.4450645 21.701346,35.7767637 20.7553776,32.160536 Z"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <g transform="translate(2.000000, 3.000000)">
                    <path
                      d="M8.5,1 C4.35786438,1 1,4.35786438 1,8.5 L1,13 C1,14.6568542 2.34314575,16 4,16 L13,16 C14.6568542,16 16,14.6568542 16,13 L16,4 C16,2.34314575 14.6568542,1 13,1 L8.5,1 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M4,20 C2.34314575,20 1,21.3431458 1,23 L1,27.5 C1,31.6421356 4.35786438,35 8.5,35 L13,35 C14.6568542,35 16,33.6568542 16,32 L16,23 C16,21.3431458 14.6568542,20 13,20 L4,20 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M23,1 C21.3431458,1 20,2.34314575 20,4 L20,13 C20,14.6568542 21.3431458,16 23,16 L32,16 C33.6568542,16 35,14.6568542 35,13 L35,8.5 C35,4.35786438 31.6421356,1 27.5,1 L23,1 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M34.5825451,33.4769886 L38.3146092,33.4322291 C38.8602707,33.4256848 39.3079219,33.8627257 39.3144662,34.4083873 C39.3145136,34.4123369 39.3145372,34.4162868 39.3145372,34.4202367 L39.3145372,34.432158 C39.3145372,34.9797651 38.8740974,35.425519 38.3265296,35.4320861 L34.5944655,35.4768456 C34.048804,35.4833899 33.6011528,35.046349 33.5946085,34.5006874 C33.5945611,34.4967378 33.5945375,34.4927879 33.5945375,34.488838 L33.5945375,34.4769167 C33.5945375,33.9293096 34.0349773,33.4835557 34.5825451,33.4769886 Z"
                      fill="currentColor"
                      transform="translate(36.454537, 34.454537) rotate(-315.000000) translate(-36.454537, -34.454537) "
                    />
                    <circle
                      stroke="currentColor"
                      strokeWidth={2}
                      cx="27.5"
                      cy="27.5"
                      r="7.5"
                    />
                  </g>
                </g>
              </svg>
              <span className="tab tab-kategori block text-xs">My Group</span>
            </a>
          </NavLink>

          <NavLink to={'/userstatistics'}>
            <a
              href="#"
              className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
            >
              <i class="fa-solid fa-circle-plus fa-lg"></i>
              <span className="tab tab-explore block text-xs mt-1">Add Notes</span>
            </a>
          </NavLink>



          <NavLink to={'/dashboard'}>
            <a
              href="#"
              className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
            >
              <i class="fa-solid fa-rocket fa-xl"></i>

              <span className="tab tab-whishlist block text-xs mt-1">
                Dashboard
              </span>
            </a>
          </NavLink>

          <NavLink to={'/profile'} >
            <a
              href="#"
              className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
            >
              <svg
                width={25}
                height={25}
                viewBox="0 0 42 42"
                className="inline-block mb-1"
              >
                <g
                  stroke="none"
                  strokeWidth={1}
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    d="M14.7118754,20.0876892 L8.03575361,20.0876892 C5.82661462,20.0876892 4.03575361,18.2968282 4.03575361,16.0876892 L4.03575361,12.031922 C4.03575361,8.1480343 6.79157254,4.90780265 10.4544842,4.15995321 C8.87553278,8.5612583 8.1226025,14.3600511 10.9452499,15.5413938 C13.710306,16.6986332 14.5947501,18.3118357 14.7118754,20.0876892 Z M14.2420017,23.8186831 C13.515543,27.1052019 12.7414284,30.2811559 18.0438552,31.7330419 L18.0438552,33.4450645 C18.0438552,35.6542035 16.2529942,37.4450645 14.0438552,37.4450645 L9.90612103,37.4450645 C6.14196811,37.4450645 3.09051926,34.3936157 3.09051926,30.6294627 L3.09051926,27.813861 C3.09051926,25.604722 4.88138026,23.813861 7.09051926,23.813861 L14.0438552,23.813861 C14.1102948,23.813861 14.1763561,23.8154808 14.2420017,23.8186831 Z M20.7553776,32.160536 C23.9336213,32.1190063 23.9061943,29.4103976 33.8698747,31.1666916 C34.7935223,31.3295026 35.9925894,31.0627305 37.3154077,30.4407183 C37.09778,34.8980343 33.4149547,38.4450645 28.9036761,38.4450645 C24.9909035,38.4450645 21.701346,35.7767637 20.7553776,32.160536 Z"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <g transform="translate(2.000000, 3.000000)">
                    <path
                      d="M8.5,1 C4.35786438,1 1,4.35786438 1,8.5 L1,13 C1,14.6568542 2.34314575,16 4,16 L13,16 C14.6568542,16 16,14.6568542 16,13 L16,4 C16,2.34314575 14.6568542,1 13,1 L8.5,1 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M4,20 C2.34314575,20 1,21.3431458 1,23 L1,27.5 C1,31.6421356 4.35786438,35 8.5,35 L13,35 C14.6568542,35 16,33.6568542 16,32 L16,23 C16,21.3431458 14.6568542,20 13,20 L4,20 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M23,1 C21.3431458,1 20,2.34314575 20,4 L20,13 C20,14.6568542 21.3431458,16 23,16 L32,16 C33.6568542,16 35,14.6568542 35,13 L35,8.5 C35,4.35786438 31.6421356,1 27.5,1 L23,1 Z"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <path
                      d="M34.5825451,33.4769886 L38.3146092,33.4322291 C38.8602707,33.4256848 39.3079219,33.8627257 39.3144662,34.4083873 C39.3145136,34.4123369 39.3145372,34.4162868 39.3145372,34.4202367 L39.3145372,34.432158 C39.3145372,34.9797651 38.8740974,35.425519 38.3265296,35.4320861 L34.5944655,35.4768456 C34.048804,35.4833899 33.6011528,35.046349 33.5946085,34.5006874 C33.5945611,34.4967378 33.5945375,34.4927879 33.5945375,34.488838 L33.5945375,34.4769167 C33.5945375,33.9293096 34.0349773,33.4835557 34.5825451,33.4769886 Z"
                      fill="currentColor"
                      transform="translate(36.454537, 34.454537) rotate(-315.000000) translate(-36.454537, -34.454537) "
                    />
                    <circle
                      stroke="currentColor"
                      strokeWidth={2}
                      cx="27.5"
                      cy="27.5"
                      r="7.5"
                    />
                  </g>
                </g>
              </svg>
              <span className="tab tab-account block text-xs">Profile</span>
            </a>
          </NavLink>

        </div>
      </section>


    </>
  );
};

export default Navbar;
