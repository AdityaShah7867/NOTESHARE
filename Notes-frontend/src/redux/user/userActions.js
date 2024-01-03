import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


// http://localhost:4000/api/v1/users/getUserInfo/6501e34bc36bdc85aed140c4


const host = process.env.REACT_APP_API_HOST;


export const removeSkills = createAsyncThunk(
    'user/removeSkills',

    async (skills, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/skills/removeSkills`, {
                skills
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            }
            )
            if (response.status === 200) {
                console.log(response.data);
                toast.success(response.data.message);
                return response.data;
            }
            else {
                toast.error(response.data.message)
                return rejectWithValue(response.data.message)
            }

        }
        catch (error) {
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message);
        }

    }
)



export const getUserSkills = createAsyncThunk(
    'user/getUserSkills',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/skills/getSkills`, {
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


export const addSkills = createAsyncThunk(
    'user/addSkills',
    async (skills, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/skills/createSkills`, {
                skills
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                toast.success(response.data.message);
                return response.data;
            }
            else {
                toast.error(response.data.message)
                return rejectWithValue(response.data.message)
            }

        }
        catch (error) {
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message);
        }
    }
)



export const getUserInfo = createAsyncThunk(
    'user/getUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/users/getUserInfo`, {
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


export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async (username, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/users/getUserProfile/${username}`, {
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

export const getUsersLeaderBoard = createAsyncThunk(
    'user/getUsersLeaderBoard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/users/getUsersLeaderBoard`)

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


// export const editProfile = createAsyncThunk(
//     'user/editProfile',
//     async (formdata, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(`${host}/api/v1/users/editProfile`, {
//                 username: formdata.username,
//                 Bio: formdata.bio,
//                 profile: formdata.profile,
//                 githubUsername: formdata.github,
//                 Department: formdata.department,

//             }, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('authtoken')}`
//                 }
//             })

//             if (response.status === 200) {
//                 console.log(response.data);
//                 toast.success('Profile Updated Successfully');
//                 return response.data;

//             }
//             else {
//                 return rejectWithValue(response.data.message)
//             }
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message);
//         }
//     }
// )

export const editProfile = createAsyncThunk(
    'user/editProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const authToken = localStorage.getItem('authtoken');

            // Create a new FormData object
            const formNew = new FormData();

            // Append the form fields to the FormData object
            formNew.append('username', formData.username);
            formNew.append('Bio', formData.bio);
            formNew.append('githubUsername', formData.github);
            formNew.append('Department', formData.department);

            // Append the profile picture as 'profile' (matching the name attribute on the input)
            formNew.append('profile', formData.profile);


            // Make the Fetch API request with multipart/form-data content type
            const response = await fetch(`${host}/api/v1/users/editProfile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formNew, // Use the FormData object as the body
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                toast.success('Profile Updated Successfully');
                return data;
            } else {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
    }
)



export const seachUser = createAsyncThunk(
    'user/searchUser',
    async (username, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${host}/api/v1/users/searchUser?username=${username}`, {
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


export const lottery = createAsyncThunk(
    'user/lottery',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${host}/api/v1/transfer/lottery`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                toast.success(response.data.message);
                return response.data;
            }
            else {
                toast.error(response.data.message)
                return rejectWithValue(response.data.message)

            }
        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data?.message);
        }
    }
)