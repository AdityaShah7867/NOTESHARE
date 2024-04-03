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
    const [skills, setSkills] = useState([])

    const dispatch = useDispatch();

    const { username } = useParams();

    useEffect(() => {
        dispatch(getUserSkills())
    }, [dispatch])

   


    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state?.userDetails?.userProfile)
    const currentUser=useSelector((state)=>state?.user?.user)
    


    const [githubLink, setGithubLink] = useState(
        "https://github.com/yourusername"
    );
    const [profileImage, setProfileImage] = useState(
        user?.profile
    );

    const fetchRepos = async () => {
        const githubUsername = user?.githubUsername;
        if (githubUsername !== undefined) {
            try {
                const response = await fetch(
                    `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc`
                )
                const data = await response.json()
                const firstThreeRepos = data.slice(0, 10);
                setRepositories(firstThreeRepos);
                setLoading(false);
            } catch (error) {
            }
        } else {
            setRepositories(null)
        }

    }

    useEffect(() => {
        fetchRepos();
    }, [user, username]);

    const fetchSkillsByUsername = async () => {
        const response = await fetch(`http://localhost:4000/api/v1/skills/getSkills/${username}`)
        const data = await response.json()
        setSkills(data.skills)
    }


    useEffect(() => {
        dispatch(getUserProfile(username));
        fetchSkillsByUsername();
    }, [dispatch, username]);


    console.log('username',currentUser.username , username , currentUser.username === username)



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
        <title>{`${user?.username}'s Profile`}</title> <meta name="description" content={user?.Bio} />

        <meta name="description" content={`Noteshare is a students community`} />

        <meta property="og:title" content={`${user?.username}'s Profile`}  />
        <meta property="og:description" content={user?.Bio} />
        <meta property="og:image" content={user?.profile} />
        <meta property="og:url" content={`https://yourdomain.com/profile/${user?.username}`} />

        <meta property="whatsapp:title" content={`${user?.username}'s Profile`} />
        <meta property="whatsapp:description" content={user?.Bio} />
        <meta property="whatsapp:image" content={user?.profile} />



      </Helmet>

            <Alternates>
                <div>
                    <div className="flex flex-col md:flex-row">
                        {/* Left side - 1/3 */}
                        <motion.div className="w-full md:w-1/3 p-4"
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn('right', 0.3)}>
                            <div className="mt-5 ">
                                <div className="max-w-md mx-auto bg-white px-6 py-3 rounded-xl overflow-hidden md:max-w-2xl mt-5 ">


                                    <div className="flex justify-between">
                                        <img
                                            className="w-40 h-40 mt-4 rounded-full"
                                            src={user?.profile}
                                            alt="Profile Image"
                                        />
                                         {
                                            currentUser?.username === username && (
                                                <NavLink to='/setting'>
                                            <p className="text-right border-2 bg-blue-500  text-white hover:bg-blue-700 p-2 px-4 rounded-lg">
                                                <i class="bi bi-pencil-square mr-3 "></i>
                                                EDIT</p>
                                        </NavLink> 
                                            )
                                        }

                                       
                                    </div>
                                    <div className="text-left mt-2">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {user?.username} <p className="text-sm text-gray-600 mt-3">({user?.year}/{user?.Department})</p>
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-3">Email Address:</p>
                                        <p>{user?.email}</p>
                                        <p className="text-sm text-gray-600 mt-3">GitHub ID</p>
                                        <a href={`https://github.com/${user?.githubUsername}`} className="text-blue-500"> https://github.com/{user?.githubUsername}</a>
                                        <p className="text-sm text-gray-600 mt-5">BIO</p>
                                        <p className="mb-3">
                                            {user?.Bio}
                                        </p>
                                    </div>
                                </div>
                                <div className="max-w-md mx-auto border-2 bg-white rounded-xl mb-5 overflow-hidden md:max-w-2xl mt-8 p-8">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Skills:
                                        </label>
                                        <div className="flex flex-wrap">
                                            {skills?.map((skill, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full m-1"
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="bg-blue-600 hover:bg-blue-700 flex gap-2 text-white py-2 px-4 m-5 rounded">
                                    <a href="https://cv-host.netlify.app" target="_blank" className="flex gap-2 text-center justify-center mx-auto">
                                        <h1 className="text-xl">Create Your Resume</h1>
                                        <h1 className="text-xs mt-2">(by resume builder)</h1>
                                    </a>
                                </div> */}
                            </div>


                        </motion.div>

                        {/* Right side - 2/3 */}
                        <motion.div className="w-full md:w-2/3 p-4"
                            initial='hidden'
                            whileInView={'show'}
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn('left', 0.3)}>
                            <div className="mt-5">
                                <div className="w-full ">
                                    <div className="mt-5"></div>
                                    {repositories?.map((repo) => (
                                        <div
                                            className="bg-white p-4 rounded-lg shadow-lg mb-4"
                                            key={repo.id}
                                        >
                                            <div className="flex items-center mb-3">
                                                <img
                                                    src={repo.owner.avatar_url}
                                                    alt={repo.owner.login}
                                                    className="w-12 h-12 rounded-full mr-3"
                                                />
                                                <div>
                                                    <h1 className=" sm:text-xs lg:text-xl font-semibold">
                                                        {repo.name}
                                                    </h1>
                                                    <p className="text-gray-600">{repo.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800 to-black px-4 py-2 rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900"
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        height="24"
                                                        width="24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fill="#FFFFFF"
                                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                                        ></path>
                                                    </svg>
                                                    Go To Repo
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Alternates>
        </>
    );

};

export default Profile;
