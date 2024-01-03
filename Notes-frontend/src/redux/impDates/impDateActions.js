import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { toast } from "react-toastify";

const host = process.env.REACT_APP_API_HOST;
const authToken = localStorage.getItem('authtoken');

export const fetchImpDates = createAsyncThunk(
    'impDates/fetchImpDates',
    async (_, { rejectWithValue }) => {


        try {
            const response = await axios.get(`${host}/api/v1/impDates/get`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


export const createImpDate = createAsyncThunk(
    'impDates/createImpDate',
    async (formdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${host}/api/v1/impDates/create`,
                {
                    title: formdata.title,
                    date: formdata.date,
                    description: formdata.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,

                    },
                }
            );
            if (response.status === 201) {
                toast.success(response.data.message);
                return response.data.impDate;
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