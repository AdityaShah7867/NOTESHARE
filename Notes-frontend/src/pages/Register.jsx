import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import logo from "../logoOld.png";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import BLOGO from "../Logo/1.png";
import IMG from "../components/Land/abc.png";
import IMG2 from "../components/images/new2.png";
import IMG3 from "../components/images/new3.png";
import IMG4 from "../components/images/new4.png";

const Register = () => {
  const dispatch = useDispatch();
  const isloading = useSelector((state) => state?.user?.loading);

  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    Department: "",
  });

  const [seepasword, setseepassword] = useState(false);

  const onChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleviewpassword = () => {
    setseepassword(!seepasword);
    if (seepasword) {
      document.getElementById('password').type = 'password';
      document.getElementById('cpassword').type = 'password';
    } else {
      document.getElementById('password').type = 'text';
      document.getElementById('cpassword').type = 'text';
    }
  };

  const validation = () => {
    if (formdata.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    }

    if (formdata.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (formdata.password !== formdata.cpassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!/^[A-Za-z0-9]+$/.test(formdata.username)) {
      toast.error("Username can only contain letters and numbers");
      return false;
    }

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(formdata.password)) {
      toast.error("Password must be strong: at least one uppercase letter, one lowercase letter, one digit, and one special character");
      return false;
    }



    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) {
      return;
    }
    try {
      // const success = await register(formdata.username, formdata.email, formdata.password);
      // if (success) {
      //   toast.success('User registered successfully!');
      //   setFormdata({ username: '', email: '', password: '', cpassword: '' });
      // }
      // else {
      //
      dispatch(register(formdata));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "User registration failed!";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div>
        <h1>CREATE AN ACCOUNT</h1>
        <section className="min-h-screen flex items-stretch text-white ">
          <div
            className="lg:flex w-1/2 animate-updown hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
            style={{
              backgroundImage: `url(${IMG3})`,
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
                backgroundImage: `url(${IMG4})`,
                alignItems: "center",
                justifyContent: "center",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >

              <div className="absolute bg-black opacity-60 inset-0 z-0" />
            </div>
            <div className="w-full py-6 z-20">
              <h1 className="my-6">
                <center>
                  <img src={BLOGO} alt="Logo Here" style={{ width: "50%" }} />
                </center>
              </h1>
              <br />

              <p className="text-gray-100">
                <br />
              </p>
              <form
                action
                className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
                onSubmit={handleSubmit}
              >
                <div className="pb-2 pt-4">
                  <input
                    type="text"
                    onChange={onChange}
                    name="username"
                    id="username"
                    placeholder="UserName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>

                  <input
                    type="email"
                    onChange={onChange}
                    name="email"
                    id="email"
                    value={formdata.email}
                    className="bg-gray-50 border mt-3 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name.Id@vcet.edu.in"
                    required
                  />
                </div>

                <div>

                  <select
                    onChange={onChange}
                    name="Department"
                    id="Department"
                    value={formdata.Department}
                    className="bg-gray-50 border mt-4 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">Select a Department</option>
                    <option value="IT">IT</option>
                    <option value="COMPS">COMPS</option>
                    <option value="CSE">CSE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">AIDS</option>
                  </select>
                </div>

                <div className="pb-2 pt-4">

                  <input
                    type="password"
                    onChange={onChange}
                    name="password"
                    id="password"
                    placeholder="PASSWORD"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="pb-2 pt-4">
                  <input
                    type="password"
                    onChange={onChange}
                    name="cpassword"
                    id="cpassword"
                    placeholder="CONFIRM PASSWORD"
                    className="bg-gray-50 border -mt-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      onClick={handleviewpassword}
                      id="viewpassword"
                      name="viewpassword"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      View password
                    </label>
                  </div>
                </div>
                <div className="text-right text-gray-400 hover:underline hover:text-gray-100">
                  <a href="#">Forgot your password?</a>
                </div>
                <div className="px-4 pb-2 pt-4">
                  <button className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
                    {isloading ? (
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                        <span>Registering ...</span>
                      </div>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                </div>
                <div className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden ">

                </div>
                <div className="mt-12 text-sm font-display font-semibold text-white text-center">
                  Already have an account ? &nbsp;
                  <NavLink
                    to="/login"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                  >
                    Sign In
                  </NavLink>
                </div>

                <div className=" text-indigo-600 hover:cursor-pointer">
                  Resend verification email?
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
