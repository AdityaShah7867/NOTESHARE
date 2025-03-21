import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Profile";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../Variants";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile, getUserSkills } from "../redux/user/userActions";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet";

const Profile = () => {
    const [showLoader, setShowLoader] = useState(true);
    const [skills, setSkills] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const dispatch = useDispatch();
    const { username } = useParams();
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state?.userDetails?.userProfile);
    const currentUser = useSelector((state) => state?.user?.user);

    useEffect(() => {
        dispatch(getUserSkills());
    }, [dispatch]);

    const fetchRepos = async () => {
        const githubUsername = user?.githubUsername;
        if (githubUsername !== undefined) {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc`
                );
                const data = await response.json();
                const recentRepos = data.slice(0, 10);
                setRepositories(recentRepos);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching repos:", error);
                setLoading(false);
            }
        } else {
            setRepositories(null);
            setLoading(false);
        }
    };

    const fetchSkillsByUsername = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/v1/skills/getSkills/${username}`
            );
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
        if (user?.githubUsername) {
            fetchRepos();
        }
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

    // Generate random contribution data for the activity graph
    const generateContributionData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map(month => ({
            month,
            value: Math.floor(Math.random() * 70) + 10
        }));
    };

    const contributionData = generateContributionData();

    return (
        <>
            <Helmet>
                <title>{`${user?.username}'s Profile`}</title>
                <meta name="description" content={user?.Bio} />
                <meta property="og:title" content={`${user?.username}'s Profile`} />
                <meta property="og:description" content={user?.Bio} />
                <meta property="og:image" content={user?.profile} />
                <meta
                    property="og:url"
                    content={`https://yourdomain.com/profile/${user?.username}`}
                />
                <meta property="whatsapp:title" content={`${user?.username}'s Profile`} />
                <meta property="whatsapp:description" content={user?.Bio} />
                <meta property="whatsapp:image" content={user?.profile} />
            </Helmet>

            <Alternates>
                <div className="min-h-screen bg-gray-900 text-gray-100">
                    {/* Purple Gradient Header */}
                    <div className="bg-gradient-to-br from-indigo-700 via-purple-600 to-indigo-800 py-10 px-6 rounded-b-3xl">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Profile Picture with Edit Button */}
                                <div className="relative">
                                    <div className="w-36 h-36 rounded-full border-4 border-white/30 overflow-hidden">
                                        <img 
                                            src={`${process.env.REACT_APP_API_HOST}/` + user?.profile} 
                                            alt={user?.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {currentUser?.username === username && (
                                        <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg">
                                            <i className="bi bi-pencil-fill text-purple-600 text-xs"></i>
                                        </button>
                                    )}
                                </div>
                                
                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                        {user?.username?.toUpperCase()}
                                    </h1>
                                    
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 text-white/80 mb-6">
                                        <div className="flex items-center">
                                            <i className="bi bi-envelope mr-2"></i>
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="bi bi-github mr-2"></i>
                                            <span>{user?.githubUsername}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="bi bi-geo-alt mr-2"></i>
                                            <span>{user?.city || "Mumbai, India"}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Department/Year Pills */}
                                    <div className="flex gap-2 justify-center md:justify-start mb-7">
                                        <span className="px-4 py-1 bg-indigo-600/40 rounded-full text-white/90 backdrop-blur-sm">
                                            {user?.Department || "IT"}
                                        </span>
                                        <span className="px-4 py-1 bg-indigo-600/40 rounded-full text-white/90 backdrop-blur-sm">
                                            {user?.year || "TE"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-white">12</div>
                                    <div className="text-sm text-white/70">Notes</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-white">128</div>
                                    <div className="text-sm text-white/70">Contributions</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-white">45</div>
                                    <div className="text-sm text-white/70">Followers</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-white">32</div>
                                    <div className="text-sm text-white/70">Following</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Navigation Tabs */}
                    <div className="border-b border-gray-800">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`py-4 px-1 ${
                                        activeTab === "overview"
                                            ? "border-b-2 border-indigo-500 text-indigo-400"
                                            : "text-gray-400 hover:text-gray-300"
                                    } flex items-center`}
                                >
                                    <i className="bi bi-grid-1x2 mr-2"></i>
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("repositories")}
                                    className={`py-4 px-1 ${
                                        activeTab === "repositories"
                                            ? "border-b-2 border-indigo-500 text-indigo-400"
                                            : "text-gray-400 hover:text-gray-300"
                                    } flex items-center`}
                                >
                                    <i className="bi bi-github mr-2"></i>
                                    Repositories
                                </button>
                                <button
                                    onClick={() => setActiveTab("statistics")}
                                    className={`py-4 px-1 ${
                                        activeTab === "statistics"
                                            ? "border-b-2 border-indigo-500 text-indigo-400"
                                            : "text-gray-400 hover:text-gray-300"
                                    } flex items-center`}
                                >
                                    <i className="bi bi-bar-chart mr-2"></i>
                                    Statistics
                                </button>
                                <button
                                    onClick={() => setActiveTab("notes")}
                                    className={`py-4 px-1 ${
                                        activeTab === "notes"
                                            ? "border-b-2 border-indigo-500 text-indigo-400"
                                            : "text-gray-400 hover:text-gray-300"
                                    } flex items-center`}
                                >
                                    <i className="bi bi-sticky mr-2"></i>
                                    Notes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-8">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* About Me Section */}
                                <div className="rounded-lg border border-gray-800">
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold flex items-center mb-4">
                                            <i className="bi bi-person-badge mr-2"></i> About Me
                                        </h2>
                                        <div className="bg-gray-800 rounded-lg p-6">
                                            <p className="text-gray-300">{user?.Bio || "No bio available."}</p>
                                            
                                            <div className="mt-4 flex items-center text-gray-400">
                                                <div className="flex items-center mr-6">
                                                    <i className="bi bi-geo-alt mr-2"></i>
                                                    <span>{user?.city || "Mumbai, India"}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <i className="bi bi-mortarboard mr-2"></i>
                                                    <span>{user?.Department || "IT"}, {user?.year || "TE"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills & Expertise */}
                                <div className="rounded-lg border border-gray-800">
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold flex items-center mb-4">
                                            <i className="bi bi-code-slash mr-2"></i> Skills & Expertise
                                        </h2>
                                        {skills?.length > 0 ? (
                                            <div className="bg-gray-800 rounded-lg p-6">
                                                <div className="flex flex-wrap gap-3">
                                                    {skills.map((skill, index) => (
                                                        <div 
                                                            key={index}
                                                            className="px-4 py-2 rounded-full bg-gray-700 text-indigo-300 flex items-center"
                                                        >
                                                            <span className="mr-2">•</span> {skill}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-800 rounded-lg p-6 text-center">
                                                <p className="text-gray-400">No skills added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Featured Projects */}
                                <div className="rounded-lg border border-gray-800">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold flex items-center">
                                                <i className="bi bi-star mr-2"></i> Featured Projects
                                            </h2>
                                            <button 
                                                onClick={() => setActiveTab("repositories")}
                                                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                                            >
                                                View all <i className="bi bi-arrow-right ml-1"></i>
                                            </button>
                                        </div>
                                        {loading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                            </div>
                                        ) : repositories?.length > 0 ? (
                                            <div className="bg-gray-800 rounded-lg">
                                                {repositories.slice(0, 2).map((repo) => (
                                                    <div
                                                        key={repo.id}
                                                        className="p-6 border-b border-gray-700 last:border-0"
                                                    >
                                                        <div className="flex items-center mb-2">
                                                            <i className="bi bi-github text-gray-400 mr-2"></i>
                                                            <h3 className="text-lg font-semibold text-indigo-300">{repo.name}</h3>
                                                        </div>
                                                        <p className="text-gray-400 mb-4">
                                                            {repo.description || "No description available."}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center text-gray-400">
                                                                    <span
                                                                        className={`inline-block w-3 h-3 rounded-full mr-1 ${
                                                                            repo.language === "JavaScript"
                                                                                ? "bg-yellow-400"
                                                                                : repo.language === "TypeScript"
                                                                                ? "bg-blue-500"
                                                                                : repo.language === "Python"
                                                                                ? "bg-green-500"
                                                                                : repo.language === "Java"
                                                                                ? "bg-orange-500"
                                                                                : repo.language === "HTML"
                                                                                ? "bg-red-500"
                                                                                : repo.language === "CSS"
                                                                                ? "bg-purple-500"
                                                                                : "bg-gray-500"
                                                                        }`}
                                                                    ></span>
                                                                    {repo.language || "No language"}
                                                                </div>
                                                                <div className="flex items-center text-gray-400">
                                                                    <i className="bi bi-star mr-1"></i>
                                                                    <span className="text-sm">
                                                                        {repo.stargazers_count}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-gray-400">
                                                                    <i className="bi bi-diagram-2 mr-1"></i>
                                                                    <span className="text-sm">
                                                                        {repo.forks_count}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-gray-400">
                                                                    <span className="text-xs">
                                                                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-800 rounded-lg p-8 text-center">
                                                <i className="bi bi-github text-4xl text-gray-600 mb-3"></i>
                                                <h3 className="text-lg font-medium text-gray-300 mb-1">
                                                    No repositories found
                                                </h3>
                                                <p className="text-gray-500">
                                                    {user?.githubUsername
                                                        ? `${user.githubUsername} doesn't have any public repositories yet.`
                                                        : "No GitHub username provided."}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Repositories Tab */}
                        {activeTab === "repositories" && (
                            <div>
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold mb-4">All Repositories</h1>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search repositories..."
                                            className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <i className="bi bi-search absolute left-3 top-3.5 text-gray-500"></i>
                                    </div>
                                </div>
                                
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : repositories?.length > 0 ? (
                                    <div className="space-y-4">
                                        {repositories.map((repo) => (
                                            <div
                                                key={repo.id}
                                                className="p-6 bg-gray-800 border border-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <h3 className="text-lg font-semibold text-blue-300 mr-2">{repo.name}</h3>
                                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">Public</span>
                                                        </div>
                                                        <p className="text-gray-400 mt-2 mb-4">
                                                            {repo.description || "No description available."}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="text-gray-400 hover:text-gray-200">
                                                            <i className="bi bi-bookmark"></i>
                                                        </button>
                                                        <button className="text-gray-400 hover:text-gray-200">
                                                            <i className="bi bi-star"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <div className="flex items-center text-gray-400">
                                                        <span
                                                            className={`inline-block w-3 h-3 rounded-full mr-1 ${
                                                                repo.language === "JavaScript"
                                                                    ? "bg-yellow-400"
                                                                    : repo.language === "TypeScript"
                                                                    ? "bg-blue-500"
                                                                    : repo.language === "Python"
                                                                    ? "bg-green-500"
                                                                    : repo.language === "Java"
                                                                    ? "bg-orange-500"
                                                                    : repo.language === "HTML"
                                                                    ? "bg-red-500"
                                                                    : repo.language === "CSS"
                                                                    ? "bg-purple-500"
                                                                    : "bg-gray-500"
                                                            }`}
                                                        ></span>
                                                        {repo.language || "No language"}
                                                    </div>
                                                    <div className="flex items-center text-gray-400">
                                                        <i className="bi bi-star mr-1"></i>
                                                        <span className="text-sm">
                                                            {repo.stargazers_count}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-400">
                                                        <i className="bi bi-diagram-2 mr-1"></i>
                                                        <span className="text-sm">
                                                            {repo.forks_count}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-400">
                                                        <span className="text-xs">
                                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                                        <i className="bi bi-github text-4xl text-gray-600 mb-3"></i>
                                        <h3 className="text-lg font-medium text-gray-300 mb-1">
                                            No repositories found
                                        </h3>
                                        <p className="text-gray-500">
                                            {user?.githubUsername
                                                ? `${user.githubUsername} doesn't have any public repositories yet.`
                                                : "No GitHub username provided."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === "statistics" && (
                            <div className="space-y-8">
                                <h1 className="text-2xl font-bold">Activity Overview</h1>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contribution Activity */}
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold mb-4">Contribution Activity</h2>
                                        <div className="h-64 flex items-end space-x-2">
                                            {contributionData.map((item, index) => (
                                                <div key={index} className="flex flex-col items-center flex-1">
                                                    <div 
                                                        className="w-full bg-indigo-500/30 hover:bg-indigo-500/50 transition-all cursor-pointer rounded-t"
                                                        style={{ height: `${item.value}%` }}
                                                    ></div>
                                                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Notes Statistics */}
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold mb-4">Notes Statistics</h2>
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-48 h-48 mb-6">
                                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                                    <circle 
                                                        cx="50" cy="50" r="40" 
                                                        fill="transparent" 
                                                        stroke="#374151" 
                                                        strokeWidth="8"
                                                    />
                                                    <circle 
                                                        cx="50" cy="50" r="40" 
                                                        fill="transparent" 
                                                        stroke="#a78bfa" 
                                                        strokeWidth="8"
                                                        strokeDasharray="251.2"
                                                        strokeDashoffset="62.8"
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                    <span className="text-4xl font-bold text-white">75%</span>
                                                    <span className="text-sm text-gray-400">Engagement</span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-indigo-300">12</div>
                                                    <div className="text-sm text-gray-400">Notes Shared</div>
                                                </div>
                                                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-purple-300">45</div>
                                                    <div className="text-sm text-gray-400">Followers</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Activity Feed */}
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
                                    <div className="space-y-6">
                                        <div className="flex">
                                            <div className="mr-4 mt-1">
                                                <div className="bg-indigo-600/20 p-2 rounded-lg">
                                                    <i className="bi bi-github text-indigo-400"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-300 mb-1">
                                                    Updated repository <span className="text-indigo-400">algorithms-visualization</span>
                                                </div>
                                                <div className="text-gray-500 text-sm mb-2">
                                                    Added new visualization for sorting algorithms
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    2 days ago
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex">
                                            <div className="mr-4 mt-1">
                                                <div className="bg-purple-600/20 p-2 rounded-lg">
                                                    <i className="bi bi-sticky text-purple-400"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-300 mb-1">
                                                    Published new note <span className="text-purple-400">Introduction to Data Structures</span>
                                                </div>
                                                <div className="text-gray-500 text-sm mb-2">
                                                    Shared with TE/IT students
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    5 days ago
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Notes Tab */}
                        {activeTab === "notes" && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">My Notes</h1>
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                                    <i className="bi bi-journals text-4xl text-gray-600 mb-3"></i>
                                    <h3 className="text-lg font-medium text-gray-300 mb-1">
                                        Notes feature coming soon
                                    </h3>
                                    <p className="text-gray-500">
                                        We're working on building a better notes experience.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Alternates>
        </>
    );
};

export default Profile;
