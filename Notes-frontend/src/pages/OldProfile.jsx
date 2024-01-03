import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Boost";
import { Link, NavLink } from "react-router-dom";
import Edit from "../components/Profile/EditProfile";

const Profile = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [githubLink, setGithubLink] = useState(
    "https://github.com/yourusername"
  );
  const [profileImage, setProfileImage] = useState(
    "https://safesiren.vercel.app/static/media/login.665ff9176f5ac11ac2e6.png"
  );

  useEffect(() => {
    const githubUsername = "adityashah7867";
    fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        setRepositories(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching repositories:", error));
  }, []);

  
  

  

  useEffect(() => {
    const githubUsername = "adityashah7867";
    fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc`
    )
      .then((response) => response.json())
      .then((data) => {
        const firstThreeRepos = data.slice(0, 3); // Changed to get the first three repos
        setRepositories(firstThreeRepos);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching repositories:", error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Alternates className="w-full">
        <div className="bg-white w-full flex flex-col md:flex-row items-center transform rotate-x-2 mt-5">
          
            <img
              src={profileImage}
              style={{ width: "20%" }}
              className="w-15 mb-4 md:mb-0"
              alt=""
            />
   

          {/* ... existing code ... */}
          <div className="flex-grow p-4 text-center md:text-left ml-5">
            <h2 className="text-xl font-bold mb-2 text-right">
              
         <NavLink>  <button >Edit</button></NavLink>     
              
            </h2>
            <h2 className="text-xl font-bold mb-2">User Name</h2>
            <p>
              
                name
             
            </p>
            <h2 className="text-xl font-bold mt-4 mb-2">Email</h2>
            <p>
             
                email
             
            </p>
            <h2 className="text-xl font-bold mt-4 mb-2">Github</h2>
            <p>
              
                <a href={githubLink} className="text-blue-500">
                  {githubLink}
                </a>
           
            </p>
          </div>
        </div>

        <hr />

        <hr />

        <div className="bg-white w-full h-screen p-8 text-center transform rotate-x-2">
          <h2 className="text-xl font-bold mb-4">Your Github Repositories</h2>

          
          <br />
          {repositories.map((repo) => (
            <div className=" rounded-lg border-2 border-black mt-2">
              <div key={repo.id} className=" p-4 max-w-32 flex items-center">
              <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-16 h-16 rounded-full ml-9o"
                />
                <h1 className="text-3xl mr-4 ml-3">{repo.full_name}</h1>
                <button class="flex gap-3 mt-6 ml-auto cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800 to-black px-7 py-3 rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
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
                </button>
                
              </div>
              <h1 className="text-xl mr-4 text-left ml-16">
                {repo.description}
              </h1>

              <br/>
            </div>
          ))}
          {/* <div className="flex flex-wrap">
  {repositories.map((repo) => (
    <div key={repo.id} className="p-4 max-w-32 flex items-center m-2">
      <img
        src={repo.owner.avatar_url}
        alt={repo.owner.login}
        className="w-16 h-16 rounded-full ml-9"
      />
      <div className="ml-3">
        <h1 className="text-3xl">{repo.full_name}</h1>
        <h1 className="text-xl mt-2">{repo.description}</h1>
        <button className="flex gap-3 mt-6 cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800 to-black px-7 py-3 rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
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
        </button>
      </div>
    </div>
  ))}
</div> */}


          <br />



          <center>
            <button class="cursor-pointer  items-end rounded-full px-9 py-3 text-xl font-mono font-semibold text-rose-600 hover:text-white border-2 border-rose-600 hover:bg-rose-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 duration-300 focus:bg-transparent focus:text-rose-600">
              <Link to={githubLink} target={"_blank"}>Button</Link>
            </button>
          </center>
        </div>
      </Alternates>
    </>
  );
};

export default Profile;
