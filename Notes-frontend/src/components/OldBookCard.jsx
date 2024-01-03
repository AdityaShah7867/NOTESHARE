import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ADSA from "./images/ADSA.png";
import DEVEOPS from "./images/DEVEOPS.png";
import SE from './images/SE.png';
import CNS from './images/cns.jpg';
import IP from './images/IP.png';
import { useSelector, useDispatch } from "react-redux";
import { buyNote, getNotes } from "../redux/notes/noteActions";

// import { get } from "mongoose";
import { getLogedinUser } from "../redux/auth/authActions";
import { likeUnlikeNote } from "../redux/likes/likeActions";
import Loader from "./Loader/Loader";





const BookCard = ({ note }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state?.user?.user);
  const buyNotesLoading = useSelector((state) => state.note.noteLoading)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleCommentClick = () => {
    setShowCommentModal(true); // Step 2
  };

  const handleBuyNote = async (noteId) => {
    await dispatch(buyNote(noteId));
    await dispatch(getNotes());
  }

  const handlelike = async (noteId) => {
    await dispatch(likeUnlikeNote(noteId));
    await dispatch(getNotes());
  }



  useEffect(() => {
    dispatch(getLogedinUser())
  }, [dispatch])

  return (
    <div className="flex flex-row md:flex-row sm:flex-row flex-wrap ml-4 lg:ml-4">
      <div className="post-card mx-2 mt-6 w-80 bg-white  rounded-lg border border-gray-600">
        <div className="flex items-center">
          <span className="title text-white mr-2 text-2xl font-semibold">
            {note?.name}
          </span>
        </div>
        <p className="text-gray-400 text-base">
          Subject : {note?.subject?.name }
        </p>
        <p className="text-gray-500 text-lg">
          {note?.desc || "No Desc"}
        </p>
        
        {/* <span className="text-gray-400">by {note.author.username}</span> */}
        <div className="image-preview max-h-36 max-w-36 rounded-full mb-4">
          <img src={note?.subject?.Image} alt="image" className="w-full h-full rounded-lg" />
        </div>
        <div className="flex justify-between items-center">
          <span className="datetime text-gray-400">
            {new Date(note?.uploadedAt).toLocaleDateString()}
          </span>

        </div>




        <div className="comment-like flex justify-around items-center p-2">
          <span onClick={() => {
            handlelike(note?._id)
          }}
            className="cursor-pointer h-40 w-50 p-3 flex items-center justify-center font-bold rounded-2xl bg-transparent hover:bg-purple-300 transition duration-150">
            <i className="fa-regular fa-heart fa-xl mx-2"></i>
            {note?.likes?.length || 0}
          </span>
          <span
          onClick={handleCommentClick}
           className="cursor-pointer h-40 w-50 p-3 flex items-center justify-center font-bold rounded-2xl bg-transparent hover:bg-purple-300 transition duration-150">
            <i className="fa-regular fa-comment fa-xl mx-2"></i>
            {note?.comments?.length || 0}
          </span>

          


          {note.purchased.includes(currentuser?.id) ? (
            <NavLink to={`/nviewer/${note?._id}`}>
              <button className="border border-black px-4 py-1 rounded-lg bg-white text-black hover:bg-black hover:text-white hover:border-white">
                View
              </button>
            </NavLink>
          ) : (

            <button className="border border-black px-4 py-1 rounded-lg bg-white text-black hover:bg-black hover:text-white hover:border-white" onClick={() => {
              handleBuyNote(note._id)
            }}>
              {buyNotesLoading ? <Loader/> : 'Buy'}
            </button>

          )}

          {showConfirmationModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
              <div className="bg-white p-8 border border-black rounded-lg shadow-md">
                <p className="text-lg font-semibold text-black ">
                  Confirm buy :{note.name}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2  border  rounded-lg bg-red-500 text-white"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => {
                      handleBuyNote(note._id)
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="bg-white p-8 border border-black rounded-lg shadow-md">
            <p className="text-lg font-semibold text-black ">Comment Modal</p>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 border  rounded-lg bg-red-500 text-white"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </button>
              {/* Add your comment modal content here */}
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default BookCard;
