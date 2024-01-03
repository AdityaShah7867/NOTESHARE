import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyNote, getNotes } from "../../redux/notes/noteActions";
import { getLogedinUser } from "../../redux/auth/authActions";
import { likeUnlikeNote } from "../../redux/likes/likeActions";
import { getCommentsByNoteId } from "../../redux/comments/commentActions";
import Loader from "../Loader/Loader";

const NewCard = ({ note, setreRender }) => {
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
    <div class="w-72 bg-white rounded-b-lg border-t-8 mx-4 border-green-400 px-4 py-5 flex flex-col justify-around shadow-md">
      <p class="text-lg font-bold font-sans">{note?.name}</p>
      <div class="py-3">
        <div className="flex gap-4">
        <p class="text-gray-400 text-sm">
        Subject: {note?.subject?.name}
        </p>
        <p class="text-gray-400 text-sm">
        Module: {note?.module}
        </p>
        </div>
        <p class="text-gray-400 text-sm">
        {note?.desc || "No description available."}
        </p>
        <div className="image-preview max-h-36 max-w-full p-2 rounded-full mb-4">
            <img src={note?.subject?.Image || "https://images.shiksha.com/mediadata/shikshaOnline/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg"} alt="image" className="w-full h-full rounded-lg" />
          </div>
      </div>
      <div class="flex justify-between">
        Likes: {note?.likes?.length || 0} 
        Comments:
       
        <div class="text-sm flex gap-2">
          
        <NavLink to={`/nviewer/${note?._id}`}>
              <button className="border border-black px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-400 hover:text-black hover:border-white">
                View
              </button>
            </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NewCard;
