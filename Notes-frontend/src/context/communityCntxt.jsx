import { createContext, useContext, useState } from 'react';

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {

    const [allCommunities, setAllCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [activeTab, setActiveTab] = useState("ALLGROUPS");
    const [update, setUpdate] = useState(false);
    const [cuurentCommunity, setCurrentCommunity] = useState({});

    const triggerUpdate = () => {
        setUpdate(prev => !prev);
    };

    return (
        <UpdateContext.Provider value={{allCommunities, cuurentCommunity, setCurrentCommunity, setAllCommunities, activeTab, setActiveTab, joinedCommunities, setJoinedCommunities, update, triggerUpdate}}>
            {children}
        </UpdateContext.Provider>
    );
};

export const useUpdate = () => useContext(UpdateContext);