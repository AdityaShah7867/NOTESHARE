import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { resetPassword } from '../redux/auth/authActions';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const PasswordResetForm = ({ email }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formdata, setFormdata] = useState({
    otpCode: '',
    password: '',
    cpassword: '',
    email,
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
    if (formdata.password !== formdata.cpassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formdata.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
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
    const response = await dispatch(resetPassword(formdata));
    if (response?.payload?.status === 200) {
      navigate('/login');
    }
  };


  return (
    <div>

      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <ToastContainer />
        <div>
          <label htmlhtmlFor="username" className="block mb-2 text-sm font-medium text-gray-300 ">
            OTP CODE
          </label>
          <input

            onChange={onChange}
            name="otpCode"
            id="otpCode"
            value={formdata.otpCode}
            className=" border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="OTP CODE"
            maxLength={'6'}

            required
          />
        </div>

        <div>
          <label htmlhtmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            New Password
          </label>
          <input
            type="password"
            onChange={onChange}
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlhtmlFor="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm Password
          </label>
          <input
            type="password"
            onChange={onChange}
            name="cpassword"
            id="cpassword"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="viewpassword"
                aria-describedby="viewpassword"
                onClick={handleviewpassword}
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlhtmlFor="viewpassword" className="text-gray-500 dark:text-gray-300">
                View password
              </label>
            </div>
          </div>

        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-600 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Reset Password
        </button>


      </form>
    </div>



  );
};

export default PasswordResetForm;
