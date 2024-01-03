import axios from 'axios';
import { toast } from 'react-toastify';
const host = process.env.REACT_APP_API_HOST;
const token = localStorage.getItem('authtoken');

export const createCommunity = async (name, description) => {
    try {
        const response = await axios.post(
            `${host}/api/v1/community/create`,
            {
                name,
                description
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            }
        );
        if (response.status === 200) {
           
            return {status:200, data: response.data.community, message: response.data.message};
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const getAllCommunities = async () => {
    try {
        const response = await axios.get(
            `${host}/api/v1/community/getAllCommunities`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data.communities;
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const getYourCommunities = async () => {
    try {
        const response = await axios.get(
            `${host}/api/v1/community/get-your-communities`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data.communities;
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const joinCommunity = async (id) => {
    try {
        const response = await axios.put(
            `${host}/api/v1/community/join-community/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return {message: response.data.message, status: 200};
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const leaveCommunity = async (id) => {
    try {
        const response = await axios.put(
            `${host}/api/v1/community/leave-community/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return {message: response.data.message, status: 200};
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const fetchCommMessages = async (id) => {
    try {
        const response = await axios.get(
            `${host}/api/v1/messages/getCommunityMessages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return {messages: response.data.messages, status: 200};
        } else {
            toast.error("Error in fetching messages");
            return response.data.message;
        }
    } catch (error) {
       return error.response?.data?.message;

    }
}

export const sendMessage = async (content, community) => {
    try {
        const response = await axios.post(
            `${host}/api/v1/messages/create`,
            {
                content,
                community
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            }
        );
        if (response.status === 200) {
           
            return {status:200, data: response.data.message_, message: response.data.message};
        } else {
            toast.error(response.data.message);
            return response.data.message;
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}