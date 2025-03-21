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
    const [activeTab, setActiveTab] = useState("repositories");
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
                <div className="min-h-screen bg-gray-50">
                    {/* Top Banner */}
                    <div className="h-48 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Profile Header */}
                        <div className="relative -mt-24">
                            <motion.div
                                className="bg-white rounded-xl shadow-xl overflow-hidden"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeIn("up", 0.3)}
                            >
                                <div className="p-6 sm:p-8 flex flex-col sm:flex-row">
                                    <div className="flex-shrink-0 mb-6 sm:mb-0">
                                        <div className="relative">
                                            <img
                                                src={`${process.env.REACT_APP_API_HOST}/` + user?.profile}
                                                alt="Profile"
                                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                                            />
                                            {currentUser?.username === username && (
                                                <NavLink
                                                    to="/setting"
                                                    className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-200"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </NavLink>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 sm:ml-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-900">
                                                    {user?.username}
                                                </h1>
                                                <p className="text-indigo-600 font-medium text-lg">
                                                    {user?.year}/{user?.Department}
                                                </p>
                                            </div>

                                            {currentUser?.username === username && (
                                                <NavLink to="/setting">
                                                    <button className="mt-3 sm:mt-0 inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 shadow-md">
                                                        <i className="bi bi-pencil-square mr-2"></i>
                                                        Edit Profile
                                                    </button>
                                                </NavLink>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                            <div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center">
                                                        <i className="bi bi-envelope text-gray-500 text-xl mr-3"></i>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">
                                                                Email
                                                            </h3>
                                                            <p className="text-gray-900 font-medium">
                                                                {user?.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <i className="bi bi-github text-gray-500 text-xl mr-3"></i>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500">
                                                                GitHub
                                                            </h3>
                                                            <a
                                                                href={`https://github.com/${user?.githubUsername}`}
                                                                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                @{user?.githubUsername}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                                    Bio
                                                </h3>
                                                <p className="text-gray-800 line-clamp-3">{user?.Bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Tabs Navigation */}
                        <motion.div
                            className="mt-8"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn("up", 0.4)}
                        >
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab("repositories")}
                                        className={`${
                                            activeTab === "repositories"
                                                ? "border-indigo-600 text-indigo-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                    >
                                        <i className="bi bi-github mr-2"></i>
                                        Repositories
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("skills")}
                                        className={`${
                                            activeTab === "skills"
                                                ? "border-indigo-600 text-indigo-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                    >
                                        <i className="bi bi-lightning-charge-fill mr-2"></i>
                                        Skills
                                    </button>
                                </nav>
                            </div>
                        </motion.div>

                        {/* Tab Content */}
                        <div className="py-8">
                            {/* Repositories Tab */}
                            {activeTab === "repositories" && (
                                <motion.div
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeIn("up", 0.5)}
                                >
                                    {loading ? (
                                        <div className="flex justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : repositories?.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {repositories.map((repo) => (
                                                <div
                                                    key={repo.id}
                                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex items-start mb-4">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                                                    {repo.name}
                                                                </h3>
                                                                <div className="flex items-center mt-1 text-sm">
                                                                    <span className="flex items-center text-gray-500">
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
                                                                        {repo.language || "No language detected"}
                                                                    </span>
                                                                    <span className="mx-2 text-gray-300">•</span>
                                                                    <span className="text-gray-500">
                                                                        Updated{" "}
                                                                        {new Date(
                                                                            repo.updated_at
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                                                            {repo.description ||
                                                                "No description for this repository."}
                                                        </p>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center text-gray-600">
                                                                    <i className="bi bi-star-fill mr-1 text-amber-400"></i>
                                                                    <span className="text-sm font-medium">
                                                                        {repo.stargazers_count}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-gray-600">
                                                                    <i className="bi bi-diagram-2 mr-1 text-indigo-400"></i>
                                                                    <span className="text-sm font-medium">
                                                                        {repo.forks_count}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-gray-600">
                                                                    <i className="bi bi-eye-fill mr-1 text-green-400"></i>
                                                                    <span className="text-sm font-medium">
                                                                        {repo.watchers_count}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href={repo.html_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-200"
                                                            >
                                                                <i className="bi bi-github mr-1"></i>
                                                                View
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                                            <i className="bi bi-github text-5xl text-gray-300 mb-4"></i>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                No repositories found
                                            </h3>
                                            <p className="text-gray-500">
                                                {user?.githubUsername
                                                    ? `${user.githubUsername} doesn't have any public repositories yet.`
                                                    : "No GitHub username provided."}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === "skills" && (
                                <motion.div
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeIn("up", 0.5)}
                                    className="bg-white rounded-xl shadow-md p-8"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <i className="bi bi-lightning-charge-fill text-indigo-500 mr-2"></i>
                                        Technical Skills
                                    </h3>

                                    {skills?.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {skills.map((skill, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center p-3 rounded-lg bg-indigo-50 border border-indigo-100"
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                                    <span className="text-indigo-900 font-medium">
                                                        {skill}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <i className="bi bi-lightning-charge text-4xl text-gray-300 mb-3"></i>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                No skills added yet
                                            </h3>
                                            {currentUser?.username === username && (
                                                <p className="text-gray-500">
                                                    Add your skills to showcase your expertise to others.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </Alternates>
        </>
    );
};

export default Profile;
