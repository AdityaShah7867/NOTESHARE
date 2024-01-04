import axios from 'axios';
import { toast } from 'react-toastify';
const host = process.env.REACT_APP_API_HOST;
const token = localStorage.getItem('authtoken');

export const createCommunity = async (name, description, password, image) => {
    try {
        let pass = password ? password : null;
        let img = image ? image : null;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('password', pass);
        formData.append('image', img);

        const response = await fetch(`${host}/api/v1/community/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, // Use FormData directly as the body
        });

        const data = await response.json();

        if (response.status === 200) {
            return { status: 200, data: data.community, message: data.message };
        } else {
            toast.error(data.message);
            return { status: 400, data: null, message: data.message };
        }
    } catch (error) {
        toast.error(error?.data?.message);
        return error?.data?.message;
    }
};


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
            return { status: 400, data: null, message: response.data.message };
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
            return { status: 400, data: null, message: response.data.message };
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const joinCommunity = async (id, password) => {
    try {
        let pass = password ? password : null;
        const response = await axios.put(
            `${host}/api/v1/community/join-community/${id}`,
            {
                password: pass
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return { message: response.data.message, status: 200 };
        } else {
            toast.error(response.data.message);
            return { message: response.data.message, status: 400 };
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
            return { message: response.data.message, status: 200 };
        } else {
            toast.error(response.data.message);
            return { message: response.data.message, status: 400 };
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
            return { messages: response.data.messages, status: 200 };
        } else {
            toast.error("Error in fetching messages");
            return { messages: null, status: 400 };
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

            return { status: 200, data: response.data.message_, message: response.data.message };
        } else {
            toast.error(response.data.message);
            return { status: 400, data: null, message: response.data.message };
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const updateCommunityData = async (id, dataToUpdate) => {
    try {

        let pass = dataToUpdate.password ? dataToUpdate.password : null;
        let img = dataToUpdate.image ? dataToUpdate.image : null;

        const formData = new FormData();
        formData.append('name', dataToUpdate.name);
        formData.append('description', dataToUpdate.description);
        if (pass) {
            formData.append('password', pass);
        }
        if (img) {

            formData.append('image', img);
        }

        const response = await fetch(`${host}/api/v1/community/updateCommunity/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, 
        });

        const data = await response.json();

        if (response.status === 200) {
            return { status: 200, data: data.community, message: data.message };
        } else {
            toast.error(data.message);
            return { status: 400, data: null, message: data.message };
        }

    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }
}

export const deleteCommunity = async (id) => {

    try {
        const response = await axios.delete(
            `${host}/api/v1/community/deleteCommunity/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return { message: response.data.message, status: 200 };
        } else {
            toast.error(response.data.message);
            return { message: response.data.message, status: 400 };
        }
    } catch (error) {
        toast.error(error.response?.data?.message);
        return error.response?.data?.message;
    }

}