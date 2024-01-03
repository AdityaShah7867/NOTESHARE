import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';

const host = process.env.REACT_APP_API_HOST;

export const createTodo = createAsyncThunk(
    'todo/addTodo',
    async ({ title }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/todos/addTodo`, {
                title,

            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            }
            else {
                return rejectWithValue(response.data.message)
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }

    }

)

//getTodos
export const getTodos = createAsyncThunk(
    'todo/getTodo',
    async (_, { rejectWithValue }) => {
        try {

            const response = await axios.get(`${host}/api/v1/todos/getTodo`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }

            })

            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            }
            else {
                return rejectWithValue(response.data.message)
            }

        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }

)

//getTodosBY userid
export const getTodosByUserId = createAsyncThunk(
    'todo/getTodoByUserId',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/todos/getTodoByUserId`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }

            })

            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            }
            else {
                return rejectWithValue(response.data.message)
            }

        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

//updateTodo
export const updateTodo = createAsyncThunk(
    'todo/updateTodo',
    async (todoId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${host}/api/v1/todos/update/${todoId}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                toast.success(response.data.message)
                return response.data;

            }
            else {
                return rejectWithValue(response.data.message)
            }

        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


//deleteTodo
export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${host}/api/v1/todos/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                toast.success(response.data.message)
                return response.data;
            }
            else {
                return rejectWithValue(response.data.message)
            }

        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)



