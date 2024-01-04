import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Setting";
import Header from "../components/Community/Header";
import Filter from "../components/Community/Filter";
import { motion } from 'framer-motion';
import { fadeIn } from '../Variants';
import Card from "../components/Community/card";
import { useUpdate } from "../context/communityCntxt";
import {
  getAllCommunities,
  createCommunity,
  getYourCommunities,
} from "../helpers/commFn";
import { toast } from "react-toastify";

const Communitychat = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { activeTab, setActiveTab } = useUpdate();
  const [searchText, setSearchText] = useState("");
  const {
    allCommunities,
    setAllCommunities,
    joinedCommunities,
    setJoinedCommunities,
    update,
    triggerUpdate,
  } = useUpdate();
  const [loading, setLoading] = useState(false);

  const [comData, setCreateCommunityData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateCommunityData({ ...comData, [name]: value });
  };

  useEffect(() => {
    setLoading(true);
    const fetchAllCommunities = async () => {
      const res = await getAllCommunities().finally(() => setLoading(false));
      setAllCommunities(res);
    };
    const fetchJoinedCommunities = async () => {
      const res = await getYourCommunities().finally(() => setLoading(false));
      setJoinedCommunities(res);
    };
    fetchAllCommunities();
    fetchJoinedCommunities();
  }, [update]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comData.name === "" || comData.description === "") {
      toast.warning("Please fill all the fields");
      return;
    }
    if (comData.name.length > 20) {
      toast.warning("Name should be less than 20 characters");
      return;
    }
    if (comData.description.length > 100) {
      toast.warning("Description should be less than 100 characters");
      return;
    }

    const res = await createCommunity(comData.name, comData.description);
    if (res.status === 200) {
      toast.success(res.message);
      triggerUpdate();
      closeForm();
    } else {
      toast.warning("Something went wrong");
    }
  };

  const openForm = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    closeForm();
  };

  return (
    <Alternates>
      <div className="xl:mr-24 xl:m-0 m-5 min-h-screen">
        <Header />
        <Filter />
        <motion.div className="pb-12"
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn('up', 0.3)}>
          {loading ? (
            <h1 className="text-3xl text-bold" >Loading...</h1>
          ) : allCommunities?.length !== 0 && activeTab == "ALLGROUPS" ? (
            allCommunities?.map((comm, ind) => (
              <>
                <Card key={ind} comm={comm} ind={ind} />
              </>
            ))
          ) : joinedCommunities?.length !== 0 && activeTab == "JOINED" ? (
            joinedCommunities?.map((comm, ind) => (
              <>
                <Card key={ind} comm={comm} ind={ind} />
              </>
            ))
          ) : (
            <div className="flex justify-center items-center mt-4 gap-4 mx-auto">
              <p className="border border-gray-300 w-full text-center rounded-lg p-2 hover:cursor-pointer">
                No Communities
              </p>
            </div>
          )}
        </motion.div>
        <div className="fixed bottom-32 right-8  z-80">
          <button
            title="Add New"
            onClick={openForm}
            className="group cursor-pointer text-4xl rounded-sm hover:rotate-90 active:scale-100 duration-200"
          >

            <button
              title="Add New"
              class="group cursor-pointer outline-none hover:rotate-90 duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                class="stroke-indigo-400 fill-none group-hover:fill-indigo-800 group-active:stroke-indigo-200 group-active:fill-indigo-600 group-active:duration-0 duration-300"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke-width="1.5"
                ></path>
                <path d="M8 12H16" stroke-width="1.5"></path>
                <path d="M12 16V8" stroke-width="1.5"></path>
              </svg>
            </button>
          </button>
        </div>
        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50 z-50">
            <div className="mx-auto p-4 bg-white shadow-md rounded-md w-4/5">
              <h2 className="text-lg font-semibold mb-4">Create Community</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="GrpName"
                    className="block text-sm text-gray-500 dark:text-gray-400 transform -translate-y-3 duration-300"
                  >
                    GROUP NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="GrpName"
                    className="block w-full text-sm text-black border-b-2 border-gray-300 focus:outline-none"
                    placeholder=" "
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="floating_text"
                    className="block text-sm text-gray-500 dark:text-gray-400 transform -translate-y-3 duration-300"
                  >
                    BIO
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="floating_text"
                    className="block w-full text-sm text-black border-b-2 border-gray-300 focus:outline-none"
                    placeholder=" "
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Alternates>
  );
};

export default Communitychat;
