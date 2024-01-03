import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { login } from '../redux/auth/authActions';
import BLOGO from '../Logo/1.png'
import IMG from "../components/Land/abc.png"
import IMG2 from "../components/images/new2.png"

const Login = () => {

  const dispatch = useDispatch();
  const [formdata, setFormdata] = useState({ email: '', password: '' })
  const [seepassword, setseepassword] = useState(false)
  const loading = useSelector((state) => state.user.loading)
  const navigate = useNavigate();


  const handleViewPassword = () => {
    setseepassword(!seepassword);
    if (seepassword) {
      document.getElementById('password').type = 'password';
    }
    else {
      document.getElementById('password').type = 'text';
    }
  }

  const onChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dispatching loginUser action');

    try {
      const response = await dispatch(login(formdata));

      if (response.meta.requestStatus === "fulfilled") {
        navigate('/home');
        window.location.reload();

      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while logging in');
    }
  };

  return (
    <div>
      <section className="min-h-screen flex items-stretch text-white ">
        <div
          className="lg:flex w-1/2 animate-updown hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
          style={{
            backgroundImage: `url(${IMG2})`,

          }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0" />
          <div className="w-full px-24 z-10">
            <h1 className="text-5xl font-bold text-left tracking-wide">
              NOTES SHARE
            </h1>
            <p className="text-3xl my-4">
              connect, collaborate, and thrive in a dynamic online community.
            </p>
          </div>
          <div className="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4">

          </div>
        </div>
        <div
          className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
          style={{ backgroundColor: "#161616" }}
        >
          <div
            className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
            style={{
              backgroundImage: `url(${IMG})`, alignItems: 'center', justifyContent: 'center', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            }}

          >




            <div className="absolute bg-black opacity-60 inset-0 z-0" />
          </div>
          <div className="w-full py-6 z-20">
            <h1 className="my-6">
              <center>
                <img src={BLOGO} alt="Logo Here" style={{ width: '50%' }} />
              </center>
            </h1>
            <br />

            <p className="text-gray-100"><br /></p>
            <form action className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" onSubmit={handleSubmit}>
              <div className="pb-2 pt-4">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  onChange={onChange}
                  className="block w-full p-4 text-lg rounded-sm bg-black"
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  className="block w-full p-4 text-lg rounded-sm bg-black"
                  type="password"
                  name="password"
                  id="password"
                  onChange={onChange}
                  placeholder="Password"
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input onClick={handleViewPassword} id="viewpassword" name='viewpassword' aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">View password</label>
                </div>
              </div>
              <div className="text-right text-gray-400 hover:underline hover:text-gray-100">
                <NavLink to={'/otp'}>Forgot your password?</NavLink>
              </div>
              <div className="px-4 pb-2 pt-4">
                <button className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <span>Login</span>
                  )}

                </button>
              </div>
              <div className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden ">


              </div>
              <div className="mt-12 text-sm font-display font-semibold text-white text-center">
                Don't have an account ? &nbsp;
                <NavLink to='/register' className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                  Sign up
                </NavLink>
              </div>

              {/* <div className=' text-indigo-600 hover:cursor-pointer'  >Resend verification email?</div> */}

            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login