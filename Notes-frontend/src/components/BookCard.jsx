import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyNote, getNotes } from "../redux/notes/noteActions";
import { getLogedinUser } from "../redux/auth/authActions";
import { likeUnlikeNote } from "../redux/likes/likeActions";
import { getCommentsByNoteId } from "../redux/comments/commentActions";
import Loader from "./Loader/Loader";

const BookCard = ({ note, setreRender, viewMode }) => {
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

  const handleViewClick = (noteId) => {
    window.location.href = `/nviewer/${noteId}`;
  };

  useEffect(() => {
    dispatch(getLogedinUser());
  }, [dispatch]);

  const isPurchased = note.purchased.includes(currentuser?._id);

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:translate-y-[-5px] group">
          {/* Card Header with Status Badge */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-4 pb-14">
              <h2 className="text-xl font-bold text-white truncate mb-1 group-hover:text-blue-300 transition-colors">
                {note?.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/70 text-blue-200 border border-blue-700/50">
                  {note?.subject?.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/70 text-purple-200 border border-purple-700/50">
                  Module {note?.module}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            {isPurchased && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-900/70 text-emerald-200 border border-emerald-700/50">
                  <i className="bi bi-check-circle-fill mr-1"></i> Purchased
                </span>
              </div>
            )}
            
            {/* Overlapping Image */}
            <div className="relative -mt-10 mx-4 rounded-lg overflow-hidden aspect-video bg-gray-900 shadow-xl ring-1 ring-gray-700">
              <img 
                src={note?.subject?.Image || "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"} 
                alt="Subject" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-300 text-sm line-clamp-2">
                {note?.desc || "No description available."}
              </p>
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between mb-4">
              <NavLink to={`/profile/${note.author.username}`} className="flex items-center group/author">
                <div className="relative">
                  <img 
                    className="h-9 w-9 rounded-full border-2 border-blue-500 mr-2 group-hover/author:border-blue-400 transition-all" 
                    src={`${process.env.REACT_APP_API_HOST}/` + note.author.profile} 
                    alt="Profile" 
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-200 text-sm font-medium group-hover/author:text-blue-400 transition-colors">
                    {note.author.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(note?.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-700/50 pt-4 mt-2 flex items-center justify-between">
              <div className="flex space-x-5">
                <button 
                  onClick={() => handlelike(note?._id)}
                  className="flex items-center text-gray-400 hover:text-pink-500 transition-all group/like"
                >
                  <i className="fa-regular fa-heart mr-1.5 group-hover/like:scale-110 transition-transform"></i>
                  <span className="text-sm">{note?.likes?.length || 0}</span>
                </button>
                <button 
                  onClick={handleCommentClick}
                  className="flex items-center text-gray-400 hover:text-blue-400 transition-all group/comment"
                >
                  <i className="fa-regular fa-comment mr-1.5 group-hover/comment:scale-110 transition-transform"></i>
                  <span className="text-sm">{note?.comments?.length || 0}</span>
                </button>
              </div>
              {isPurchased ? (
                <button
                  onClick={() => handleViewClick(note._id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
                >
                  <i className="bi bi-eye mr-2"></i>
                  View
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmationModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                >
                  <i className="bi bi-wallet mr-2"></i>
                  {buyNotesLoading ? <Loader /> : "Buy"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // List View
        <div className="flex flex-col md:flex-row items-center md:items-stretch w-full p-4 bg-gray-800/30 hover:bg-gray-800/60 rounded-lg mb-2 transition-colors group">
          {/* Note Info */}
          <div className="flex md:w-[50%]">
            <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 mr-4 overflow-hidden rounded-lg shadow-md ring-1 ring-gray-700 group-hover:ring-blue-600/30 transition-all">
              <img
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={note?.subject?.Image || "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"}
                alt="Subject"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center">
                <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">{note?.name}</h3>
                {isPurchased && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-900/70 text-emerald-200 border border-emerald-700/50">
                    <i className="bi bi-check-circle-fill mr-1 text-[10px]"></i> Purchased
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/70 text-blue-200 border border-blue-700/50">
                  {note?.subject?.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/70 text-purple-200 border border-purple-700/50">
                  Module {note?.module}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1 max-w-md">{note?.desc}</p>
            </div>
          </div>

          {/* Author */}
          <div className="md:w-[20%] py-2 md:py-0 flex md:flex-col justify-center">
            <NavLink to={`/profile/${note.author.username}`} className="flex items-center group/author">
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full border-2 border-blue-500 mr-2 group-hover/author:border-blue-400 transition-all"
                  src={`${process.env.REACT_APP_API_HOST}/` + note.author.profile}
                  alt="Profile"
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <span className="text-gray-300 text-sm font-medium group-hover/author:text-blue-400 transition-colors">
                  {note.author.username}
                </span>
                <p className="text-xs text-gray-500">
                  {new Date(note?.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </NavLink>
          </div>

          {/* Activity */}
          <div className="md:w-[15%] flex md:flex-col items-center justify-center space-x-4 md:space-x-0 md:space-y-2 py-2 md:py-0">
            <button 
              onClick={() => handlelike(note?._id)}
              className="flex items-center text-gray-400 hover:text-pink-500 transition-all group/like"
            >
              <i className="fa-regular fa-heart mr-1.5 group-hover/like:scale-110 transition-transform"></i>
              <span className="text-sm">{note?.likes?.length || 0}</span>
            </button>
            <button 
              onClick={handleCommentClick}
              className="flex items-center text-gray-400 hover:text-blue-400 transition-all group/comment"
            >
              <i className="fa-regular fa-comment mr-1.5 group-hover/comment:scale-110 transition-transform"></i>
              <span className="text-sm">{note?.comments?.length || 0}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="md:w-[15%] flex items-center justify-center py-2 md:py-0">
            {isPurchased ? (
              <button
                onClick={() => handleViewClick(note._id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
              >
                <i className="bi bi-eye mr-2"></i>
                View
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmationModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
              >
                <i className="bi bi-wallet mr-2"></i>
                {buyNotesLoading ? <Loader /> : "Buy"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl border border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">
                  Comments on <span className="text-blue-400">{note?.name}</span>
                </h2>
              </div>
              <button 
                onClick={() => setShowCommentModal(false)}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-700 rounded-full transition-colors"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {commentsById.length === 0 ? (
                <div className="text-center py-12 bg-gray-700/20 rounded-xl">
                  <i className="fa-regular fa-comment-dots text-5xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400 font-medium">No comments yet</p>
                  <p className="text-gray-500 text-sm mt-1">Be the first to comment!</p>
                </div>
              ) : (
                Array.isArray(commentsById) &&
                commentsById?.map((comment) => (
                  <div
                    key={comment?._id}
                    className="mb-4 p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors border border-gray-700/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2 text-xs">
                            {comment?.user?.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-200">
                            {comment?.user?.username}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-2 bg-gray-800/50 px-2 py-0.5 rounded-full">
                          {new Date(comment?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-1 pl-9 text-sm">{comment?.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md border border-gray-700 animate-fade-in">
            <div className="bg-blue-600/20 -mx-6 -mt-6 px-6 py-4 rounded-t-xl mb-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white flex items-center">
                <i className="bi bi-wallet mr-3 text-blue-400"></i>
                Confirm Purchase
              </h3>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden mr-4 border border-gray-700">
                <img
                  className="h-full w-full object-cover"
                  src={note?.subject?.Image || "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"}
                  alt="Subject"
                />
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-1">{note.name}</h4>
                <p className="text-gray-300 text-sm">
                  Are you sure you want to purchase this note?
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center"
                onClick={() => handleBuyNote(note._id)}
              >
                <i className="bi bi-wallet mr-2"></i>
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
