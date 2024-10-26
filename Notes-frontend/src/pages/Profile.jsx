import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Profile";
import { Link, NavLink } from "react-router-dom";
import { motion } from 'framer-motion';
import { fadeIn } from '../Variants';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile, getUserSkills } from "../redux/user/userActions";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Helmet } from 'react-helmet';

const Profile = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [skills, setSkills] = useState([]);
    const dispatch = useDispatch();
    const { username } = useParams();
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state?.userDetails?.userProfile);
    const currentUser = useSelector((state) => state?.user?.user);

    useEffect(() => {
        dispatch(getUserSkills())
    }, [dispatch]);

    const fetchRepos = async () => {
        const githubUsername = user?.githubUsername;
        if (githubUsername !== undefined) {
            try {
                const response = await fetch(
                    `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc`
                );
                const data = await response.json();
                const firstThreeRepos = data.slice(0, 10);
                setRepositories(firstThreeRepos);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching repos:", error);
            }
        } else {
            setRepositories(null);
        }
    };

    const fetchSkillsByUsername = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/skills/getSkills/${username}`);
            const data = await response.json();
            setSkills(data.skills);
        } catch (error) {
            console.error("Error fetching skills:", error);
        }
    };

    useEffect(() => {
        dispatch(getUserProfile(username));
        fetchSkillsByUsername();
    }, [dispatch, username]);

    useEffect(() => {
        fetchRepos();
    }, [user, username]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [username]);

    if (showLoader) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>{`${user?.username}'s Profile`}</title>
                <meta name="description" content={user?.Bio} />
                <meta property="og:title" content={`${user?.username}'s Profile`} />
                <meta property="og:description" content={user?.Bio} />
                <meta property="og:image" content={user?.profile} />
                <meta property="og:url" content={`https://yourdomain.com/profile/${user?.username}`} />
                <meta property="whatsapp:title" content={`${user?.username}'s Profile`} />
                <meta property="whatsapp:description" content={user?.Bio} />
                <meta property="whatsapp:image" content={user?.profile} />
            </Helmet>

            <Alternates>
                <div className="min-h-screen">
                    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-8">
                        {/* Left side - Profile Section */}
                        <motion.div 
                            className="w-full md:w-1/3 space-y-6"
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn('right', 0.3)}
                        >
                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
                                    <img
                                        className="absolute bottom-0 left-6 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                        src={`${process.env.REACT_APP_API_HOST}/`+user?.profile}
                                        alt="Profile"
                                    />
                                    {currentUser?.username === username && (
                                        <NavLink to='/setting' className="absolute top-4 right-4">
                                            <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg shadow-md transition duration-200 flex items-center">
                                                <i className="bi bi-pencil-square mr-2"></i>
                                                Edit Profile
                                            </button>
                                        </NavLink>
                                    )}
                                </div>
                                
                                <div className="pt-20 pb-6 px-6">
                                    <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
                                    <p className="text-blue-600 font-medium">{user?.year}/{user?.Department}</p>
                                    
                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                            <p className="text-gray-900">{user?.email}</p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">GitHub</h3>
                                            <a 
                                                href={`https://github.com/${user?.githubUsername}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                @{user?.githubUsername}
                                            </a>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                                            <p className="text-gray-900">{user?.Bio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right side - Repository Section */}
                        <motion.div 
                            className="w-full md:w-2/3 md:pl-8 mt-6 md:mt-0"
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn('left', 0.3)}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">GitHub Repositories</h2>
                            <div className="space-y-4">
                                {repositories?.map((repo) => (
                                    <div
                                        key={repo.id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <img
                                                    src={repo.owner.avatar_url}
                                                    alt={repo.owner.login}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">{repo.name}</h3>
                                                    <p className="text-gray-600 mt-1">{repo.description}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <i className="bi bi-star-fill mr-1"></i>
                                                        {repo.stargazers_count}
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <i className="bi bi-diagram-2 mr-1"></i>
                                                        {repo.forks_count}
                                                    </div>
                                                </div>
                                                
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition duration-200"
                                                >
                                                    <i className="bi bi-github mr-2"></i>
                                                    View Repository
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Alternates>
        </>
    );
};

export default Profile;
