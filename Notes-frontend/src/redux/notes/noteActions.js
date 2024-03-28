import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify'

const authToken = localStorage.getItem('authtoken');
const host = process.env.REACT_APP_API_HOST;


export const filterdNotes = createAsyncThunk(
    'notes/filterdNotes',
    async (queryString, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/filterNote?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {

            return rejectWithValue(error.response?.data?.message);
        }
    }
)


export const getInitialNotes=createAsyncThunk(
    'notes/getinitialNotes',
    async (_,{rejectWithValue})=>{
        try {   
            const response=await axios.get(`${host}/api/v1/notes/getInitialNotesByBranch`,{
                headers:{
                    Authorization:`Bearer ${authToken}`,
                    'Content-Type':'application/json'
                }
            })
            if(response.status === 200){
                return response.data
            }else{  
                return rejectWithValue(response.data.message)
            }
            
        } catch (error) {
              
            return rejectWithValue(error.response?.data?.message);  
        }
    }
)


export const getFilteredFormData = createAsyncThunk(
    'notes/getFilteredFormData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/getFilterdFormData`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {

            return rejectWithValue(error.response?.data?.message);
        }
    }
)

export const getBookMarkedNotes = createAsyncThunk(
    'notes/getBookMarkedNotes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/getBookMarkedNotes`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)

export const bookMarkNotes = createAsyncThunk(
    'notes/bookMarkNotes',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/notes/bookmark/${noteId}`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
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
)


export const searchNote = createAsyncThunk(
    'notes/searchNote',
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/search?search=${searchText}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


export const getNotes = createAsyncThunk(
    'notes/getNotes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


//get the single note
export const getSingleNote = createAsyncThunk(
    'notes/getSingleNote',
    async (noteId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/getSingleNote/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);





export const getFormData = createAsyncThunk(
    'notes/getFormData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/getFormData`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)
export const addNote = createAsyncThunk(
    'notes/addNote',
    async (data, { rejectWithValue }) => {

        const formData = new FormData();

        for (const field in data) {
            formData.append(field, data[field]);
        }

        try {
            const response = await axios.post(`${host}/api/v1/notes/`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 201) {

                toast.success(response.data.message);
                return response.data;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {

            return rejectWithValue(error.response?.data?.message);
        }
    }
);


//get notes admin

export const getNotesAdmin = createAsyncThunk(
    'notes/getNotesAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/notes/getnotesAdmin`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                return response.data;
            } else {

                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


//accept reject notes

export const AcceptRejectNotes = createAsyncThunk(
    'notes/AcceptRejectNotes',
    async (NoteId, { rejectWithValue }) => {

        try {
            const response = await axios.put(`${host}/api/v1/notes/acceptreject/${NoteId}`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                toast.success(response.data.message);
                return response.data;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }

    }
)


//delet note

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (NoteId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${host}/api/v1/notes/deleteNote/${NoteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                toast.success(response.data.message);
                return response.data;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
)


//buy note

export const buyNote = createAsyncThunk(
    'notes/buyNote',
    async (NoteId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/notes/buyNote/${NoteId}`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {

                toast.success(response.data.message);
                return response.data;
            } else {

                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }

)

