import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'



const host = process.env.REACT_APP_API_HOST;


export const initialCall = createAsyncThunk(
    'auth/initialCall',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${host}/api/v1/users/initialCall`,
            );
            if (response.status === 200) {

                return response.data.user;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


export const register = createAsyncThunk(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/users/register`,
                {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    Department: data.Department
                }
            );
            if (response.status === 200) {

                toast.success(response.data.message);
                return response.data.user;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/users/login`,
                {
                    email: data.email,
                    password: data.password,
                }
            );
            if (response.status === 200) {

                toast.success(response.data.message);
                localStorage.setItem('authtoken', response.data.token);
                return response.data.user;

            } else {


                toast.error(response.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


export const sendResetPasswordEmail = createAsyncThunk(
    'auth/sendResetPasswordEmail',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/users/reset_email`,
                {
                    email: data.email,
                }
            );
            if (response.status === 200) {

                toast.success(response.data.message);
                return response;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/users/reset_password`,
                {
                    email: data.email,
                    otpCode: data.otpCode,
                    password: data.password,
                }
            );
            if (response.status === 200) {

                toast.success(response.data.message);
                return response;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
)





export const getLogedinUser = createAsyncThunk(
    'user/getLoggeginUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/users/get_user_info`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                return response.data.user;
            } else {


                return rejectWithValue(response.data.message)
            }
        } catch (error) {

            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);

        }
    }
)


