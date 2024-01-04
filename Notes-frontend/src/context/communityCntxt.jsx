import { createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const UpdateContext = createContext();

const useSocket = () => {
    return useContext(UpdateContext);
}


export const UpdateProvider = ({ children }) => {

    const [allCommunities, setAllCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [activeTab, setActiveTab] = useState("ALLGROUPS");
    const [update, setUpdate] = useState(false);
    const [cuurentCommunity, setCurrentCommunity] = useState({});

    const socket = io(process.env.REACT_APP_API_HOST)

    const triggerUpdate = () => {
        setUpdate(prev => !prev);
    };



    return (
        <UpdateContext.Provider value={{ socket, allCommunities, cuurentCommunity, setCurrentCommunity, setAllCommunities, activeTab, setActiveTab, joinedCommunities, setJoinedCommunities, update, triggerUpdate }}>
            {children}
        </UpdateContext.Provider>
    );
};

export const useUpdate = () => useContext(UpdateContext);

export {
    useSocket
}
