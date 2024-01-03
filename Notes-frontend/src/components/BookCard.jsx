import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyNote, getNotes } from "../redux/notes/noteActions";
import { getLogedinUser } from "../redux/auth/authActions";
import { likeUnlikeNote } from "../redux/likes/likeActions";
import { getCommentsByNoteId } from "../redux/comments/commentActions";
import Loader from "./Loader/Loader";

const BookCard = ({ note, setreRender }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state?.user?.user);
  const commentsById = useSelector((state) => state?.comment?.comments) || [];
  const buyNotesLoading = useSelector((state) => state.note.noteLoading);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleCommentClick = () => {
    setTimeout(() => {
      setShowCommentModal(true);
    }, 1000);
    dispatch(getCommentsByNoteId(note?._id));
  };

  const handleBuyNote = async (noteId) => {
    await dispatch(buyNote(noteId));
    setShowConfirmationModal(false);
    await dispatch(getNotes());
    window.location.reload();
    setreRender(true);
  };

  const handlelike = async (noteId) => {
    await dispatch(likeUnlikeNote(noteId));
    await dispatch(getNotes());
  };

  useEffect(() => {
    dispatch(getLogedinUser());
  }, [dispatch]);

  return (
    <div className="flex flex-row md:flex-row sm:flex-row flex-wrap ml-4 lg:ml-4">
      <div className="post-card mx-2 mt-6 w-80 rounded-lg border  border-gray-300 shadow-md p-4">
        <div className="flex items-center mb-2">
          <h2 className="text-black text-xl font-semibold">{note?.name}</h2>
        </div>
        <div className="flex gap-4 mb-1">
          <p className="text-gray-600 text-base">Subject: {note?.subject?.name}</p>
          <p className="text-gray-600 text-base">Module: {note?.module}</p>
        </div>

        <p className="text-gray-700 text-lg">{note?.desc || "No description available."}</p>
        <center>
          {/* <div className="image-preview max-h-36 max-w-36 rounded-full mb-4 overflow-hidden">
          <img
            className="w-full h-full object-cover rounded-lg"
            src="https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"
            alt="Note Image"
          />
        </div> */}
          <div className="image-preview max-h-36 max-w-full p-2 rounded-full mb-4">
            <img src={note?.subject?.Image || "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"} alt="image" className="w-full h-full rounded-lg" />
          </div>
        </center>
        <div className="flex gap-16 items-center mb-1">
          <span className="datetime text-gray-600">
            {new Date(note?.uploadedAt).toLocaleDateString()}
          </span>

          <NavLink to={`/profile/${note.author.username}`} className="flex gap-2">
            <img className="h-6 rounded-full" src={note.author.profile} alt="Profile" />
            <span className="text-black"> {note.author.username}</span>
          </NavLink>
        </div>
        <hr />
        <div className="comment-like flex justify-around items-center p-2">
          <span
            onClick={() => {
              handlelike(note?._id);
            }}
            className="cursor-pointer h-40 w-50 p-3 flex items-center justify-center bg-black text-red-500 font-bold rounded-2xl bg-transparent hover:bg-purple-300 transition duration-150"
          >
            <i className="fa-regular fa-heart fa-xl mx-2"></i>
            {note?.likes?.length || 0}
          </span>
          <span
            onClick={handleCommentClick}
            className="cursor-pointer h-40 w-50 p-3 flex items-center justify-center font-bold rounded-2xl bg-transparent text-black  hover:bg-purple-300 transition duration-150"
          >
            <i className="fa-regular fa-comment fa-xl mx-2"></i>
            {note?.comments?.length || 0}
          </span>

          {note.purchased.includes(currentuser?._id) ? (
            <NavLink to={`/nviewer/${note?._id}`}>
              <button className="border border-black px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-400 hover:text-black hover:border-white">
                View
              </button>
            </NavLink>
          ) : (
            <button
              className="border border-black px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-400 hover:text-black hover:border-white"
              onClick={() => {
                setShowConfirmationModal(true);
              }}
            >
              {buyNotesLoading ? <Loader /> : "Buy"}
            </button>
          )}

          {showConfirmationModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-8 border border-black rounded-lg shadow-md">
                <p className="text-lg font-semibold text-black">
                  Confirm buy: {note.name}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 border rounded-lg bg-red-500 text-white"
                    onClick={() => setShowConfirmationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => {
                      handleBuyNote(note._id);
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 border border-black rounded-lg shadow-md w-1/2">
            <p className="text-lg font-semibold text-black mb-5">
              <span className="text-blue-500"> {note?.name} </span> note
              Comments
            </p>

            {commentsById.length === 0 && <h1 className="text-2xl">No Comments Yet</h1>}

            {Array.isArray(commentsById) &&
              commentsById?.map((comment) => (
                <div
                  key={comment?._id}
                  className="mb-4 p-2 border rounded-lg shadow-md bg-white hover:shadow-lg"
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700">
                        {comment?.user?.username}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {comment?.comment}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500">
                        {new Date(comment?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 border rounded-lg bg-red-500 text-white"
                onClick={() => setShowCommentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;