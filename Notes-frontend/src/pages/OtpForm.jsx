import React from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Logo from '../Logo/1.png'
import PasswordResetForm from '../components/PasswordResetForm';
import { NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { resetPassword, sendResetPasswordEmail } from '../redux/auth/authActions'
import { useDispatch, useSelector } from 'react-redux';



const OtpForm = () => {
  const dispatch = useDispatch();

  const sendResetOtpLoading = useSelector((state) => state.user.sendResetOtpLoading);
  const [formdata, setFormdata] = useState({ email: '' });
  const [otpSent, setOtpSent] = useState(false);
  const user = useSelector((state) => state.user.user);
  const onChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
   
    e.preventDefault();
    if(formdata.email !== user.email){
      toast.error('Email does not match with your account');
      return;
    } 
    const response = await dispatch(sendResetPasswordEmail(formdata));
    if (response.payload.status === 200) {
      setOtpSent(true);
    }
  };


  return (
    <div>
      <div></div>
      <section className="bg-gray-300">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-blue-900 dark:text-blue-500 text-4xl">
            <img src={Logo} alt="" style={{width:'550px',height:'130px'}}/>
            {/* NoteShare */}
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {otpSent ? 'Reset Password' : 'Reset Password OTP'}
              </h1>
              {!otpSent ? (
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@google.com"
                      onChange={onChange}
                      value={formdata.email}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  "
                  >
                    {sendResetOtpLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>



                </form>
              ) : (
                <PasswordResetForm email={formdata.email} />
              )}
              <NavLink to="/login" className="lg:mt-9 flex items-center font-medium text-blue-800 text-primary-600 hover:underline dark:text-primary-500">
                <FaArrowLeft size={12} style={{ marginRight: '8px' }} />
                Go Back
              </NavLink>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default OtpForm;
