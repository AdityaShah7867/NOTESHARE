import React from "react";
import "../components/Land/Land.css";
// import Logo from "../components/LOGO/Logo.png";
import BLogo from "../Logo/1.png";
import BLogo2 from "../Logo/2.png";
import BLogo3 from "../Logo/3.png";

import IMG from "../components/Land/abc.png"
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react";



const Landing = () => {

  const user = useSelector((state) => state?.user?.user)
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user])
  return (
    <div className="abc ">
      <div className="bg-white dark:bg-gray-900">
        <header>
          <input
            type="checkbox"
            name="hbr"
            id="hbr"
            className="hbr peer"
            hidden
            aria-hidden="true"
          />
          <nav className="fixed z-20 w-full bg-white/90 dark:bg-gray-900/80 backdrop-blur navbar shadow-2xl shadow-gray-600/5 border-b border-gray-100 dark:border-gray-800 peer-checked:navbar-active dark:shadow-none">
            <div className="xl:container m-auto px-6 md:px-12 lg:px-6">
              <div className="flex flex-wrap items-center justify-between gap-6 md:py-3 md:gap-0 lg:py-5">
                <div className="w-full items-center flex justify-between lg:w-auto">
                  <a className="relative z-10" href="#" aria-label="logo">
                    <h1 className="text-white text-xl">NOTES SHARE</h1>
                  </a>
                  <label
                    htmlFor="hbr"
                    className="peer-checked:hamburger block relative z-20 p-6 -mr-6 cursor-pointer lg:hidden"
                  >
                    <div
                      aria-hidden="true"
                      className="m-auto h-0.5 w-5 rounded bg-gray-900 dark:bg-gray-300 transition duration-300"
                    />
                    <div
                      aria-hidden="true"
                      className="m-auto mt-2 h-0.5 w-5 rounded bg-gray-900 dark:bg-gray-300 transition duration-300"
                    />
                  </label>
                </div>
                <div className="navmenu hidden w-full flex-wrap justify-end items-center mb-16 space-y-8 p-6 border border-gray-100 rounded-3xl shadow-2xl shadow-gray-300/20 bg-white dark:bg-gray-800 lg:space-y-0 lg:p-0 lg:m-0 lg:flex md:flex-nowrap lg:bg-transparent lg:w-7/12 lg:shadow-none dark:shadow-none dark:border-gray-700 lg:border-0">
                  <div className="text-gray-600 dark:text-gray-300 lg:pr-4">
                    {/*<ul className="space-y-6 tracking-wide font-medium text-base lg:text-sm lg:flex lg:space-y-0">
                       <li>
                        <a
                          href="#"
                          className="block md:px-4 transition hover:text-primary dark:hover:text-primaryLight"
                        >
                          <span>Home</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block md:px-4 transition hover:text-primary dark:hover:text-primaryLight"
                        >
                          <span>Portfolio</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block md:px-4 transition hover:text-primary dark:hover:text-primaryLight"
                        >
                          <span>Services</span>
                        </a>
                      </li>
                    </ul> */}
                  </div>
                  <div className="w-full space-y-2 border-primary/10 dark:border-gray-700 flex flex-col -ml-1 sm:flex-row lg:space-y-0 md:w-max lg:border-l">
                    <NavLink to='/register'>
                      <a
                        href="#"
                        className="relative flex h-9 ml-auto items-center justify-center sm:px-6 before:absolute before:inset-0 before:rounded-full focus:before:bg-sky-600/10 dark:focus:before:bg-sky-400/10 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
                      >

                        <span className="relative text-sm font-semibold text-white">
                          Sign Up
                        </span>

                      </a>
                    </NavLink>
                    <NavLink to='/login'>
                      <a
                        href="#"
                        className="relative flex h-9 ml-auto items-center justify-center sm:px-6 before:absolute before:inset-0 before:rounded-full before:bg-sky-600 dark:before:bg-sky-400 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
                      >
                        <span className="relative text-sm font-semibold text-white dark:text-gray-900">
                          Login
                        </span>
                      </a>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="bg-white relative pt-40 pb-20 lg:pt-44 dark:bg-gray-900">
          <div className="relative xl:container m-auto px-6 md:px-12 lg:px-6">
            <h1 className="sm:mx-auto sm:w-10/12 md:w-2/3 font-black text-blue-900 text-4xl text-center sm:text-5xl md:text-2xl lg:w-auto lg:text-left xl:text-4xl dark:text-white ">
              <img src={BLogo} style={{ width: '30%' }} alt="" />
              <br className="lg:block hidden" />{" "}
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                FOR THE COMMUNITY, BY THE COMMUNITY.
              </span>
            </h1>
            <div className="lg:flex">
              <div className="relative mt-8 md:mt-16 space-y-8 sm:w-10/12 md:w-2/3 lg:ml-0 sm:mx-auto text-center lg:text-left lg:mr-auto lg:w-7/12">
                <p className="sm:text-lg text-gray-700 dark:text-gray-300 lg:w-11/12">
                  "Notes Share" is a website that provides handwritten notes on
                  various topics.Users can earn pointsby uploading their own
                  notes or engaging with the community, and use those points to
                  unlock more notes or purchase them from other users. The
                  website also features a leaderboard to encourage healthy
                  competition among users.
                </p>
                <span className="block font-semibold text-gray-500 dark:text-gray-400">
                  With our NoteShare, you'll find everything you need to learn about our platform, understand its benefits,<br /> and take the first step towards hassle-free note sharing and collaboration. Join our community of knowledge enthusiasts today!
                  <br /> Welcome to NOTES SHARE!
                </span>
                <div className="grid grid-cols-3 space-x-4 md:space-x-6 md:flex md:justify-center lg:justify-start">
                  <a
                    aria-label="add to slack"
                    href="#"
                    className="p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-full duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/20 dark:hover:border-cyan-300/30"
                  >
                    <div className="flex justify-center space-x-4">
                      <i class="fa-solid fa-video" style={{ color: "#ffffff", }} />
                      <span className="hidden font-medium md:block dark:text-white">
                        Video Call
                      </span>
                    </div>
                  </a>
                  <a
                    aria-label="add to chat"
                    href="#"
                    className="p-4 border border-gray-200 dark:bg-gray-800  dark:border-gray-700 rounded-full duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-lime-600/20 dark:hover:border-green-300/30"
                  >
                    <div className="flex justify-center space-x-4">
                      <i class="fa-solid fa-people-group text-white"></i>

                      <span className="hidden font-medium md:block dark:text-white">
                        Communities
                      </span>
                    </div>
                  </a>
                  <a
                    aria-label="add to zoom"
                    href="#"
                    className="p-4 border border-gray-200 dark:bg-gray-800  dark:border-gray-700 rounded-full duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/20 dark:hover:border-blue-300/30"
                  >
                    <div className="flex justify-center space-x-4">
                      <i class="fa-solid fa-trophy text-white"></i>

                      <span className="hidden font-medium md:block dark:text-white">
                        Exiting Rewards
                      </span>
                    </div>
                  </a>
                </div>
                <div className="dark:text-gray-300">
                  🔥🌟
                  <span>Other Features :</span>
                  <a
                    href="#"
                    className="font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Virtual Currency,
                  </a>
                  <a
                    href="#"
                    className="font-semibold text-gray-700 dark:text-gray-200"
                  >
                    &nbsp; Leaderboard
                  </a>
                </div>
              </div>
              <div className="mt-12 md:mt-0 lg:absolute -right-10 lg:w-7/12">
                <div className="relative w-full">
                  <div
                    aria-hidden="true"
                    className="absolute scale-75 md:scale-110 inset-0 m-auto w-full h-full md:w-96 md:h-96 rounded-full rotate-45 bg-gradient-to-r from-sky-500 to-cyan-300 blur-3xl"
                  />
                  <img
                    src={IMG}
                    className="relative w-full "
                    alt="wath illustration"
                    loading="lazy"
                    width={320}
                    height={280}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        {/* <img src={Img1} alt="image"  className="w-1/4 ml-9 bg-white"/> */}

        <section>
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="p-5 bg-white flex items-center mx-auto   mb-10 border-gray-200 rounded-lg sm:flex-row flex-col">
                <div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center flex-shrink-0">
                  <img src="https://i.ibb.co/Kb04b8S/3d-casual-life-young-man-pointing-on-contract-removebg-preview-1.png" className="w-1/2" />
                </div>
                <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                  <h1 class="text-black text-2xl title-font font-bold mb-2">
                    Students Platform
                  </h1>
                  <p class="leading-relaxed text-base">
                    Connect with your classmates. Enjoy the best quality of notes.
                  </p>

                  <a class="mt-3 text-indigo-500 inline-flex items-center">
                    Sign Up Now !
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
      <br />
      {/* component */}
      <footer className="bg-gradient-to-r from-gray-100 via-[#bce1ff] to-gray-100">
        <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <img src={BLogo3} className="mr-5  h-6 sm:h-9" alt="logo" />
              <p className="max-w-xs mt-4 text-sm text-gray-600">
                At Notes Share, we're dedicated to transparency, security, and providing the best possible experience for our users. Join us today and become a part of our thriving note-sharing community.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
              <div classname="hidden lg:flex items-center justify-end col-span-1">
                <NavLink to='./login'>
                  <button class="bg-blue-500 hover:bg-blue-700 ml-9 text-white font-bold py-2 px-4 rounded-full">
                    LOG &nbsp;IN
                  </button>
                </NavLink>
                <NavLink to='./register'>
                  <button class="bg-blue-500 mt-3 ml-9 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    SIGN UP
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
