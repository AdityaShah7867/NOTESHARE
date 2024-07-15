import { GrView } from 'react-icons/gr'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { AcceptRejectNotes, getNotesAdmin, deleteNote } from '../redux/notes/noteActions';
import { useState } from 'react';

const host = process.env.REACT_APP_API_HOST;

const ActionIcon = ({ icon, note }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAcceptRejectNotes = async (id) => {
    setLoading(true);
    await dispatch(AcceptRejectNotes(id));
    await dispatch(getNotesAdmin());
    setLoading(false);
  };

  const handleDeleteNote = async (id) => {
    setLoading(true);
    await dispatch(deleteNote(id));
    await dispatch(getNotesAdmin());
    setLoading(false);
  };

  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:text-purple-500 hover:scale-110">
      {icon === 'edit' && (
        <GrView onClick={() => {
          if (note.acceptedStatus) {
            window.open(note.file + `#toolbar=0`)
          } else {
            window.open(`${host}/` + note.file)
          }
        }} />
      )}
      {icon === 'delete' && (
        <AiFillDelete onClick={() => handleDeleteNote(note._id)} />
      )}
      {icon === 'accept' && (
        <button
          onClick={() => handleAcceptRejectNotes(note._id)}
          className={`px-2 py-1 ${!note?.acceptedStatus ? 'bg-green-500 text-white' : 'bg-red-600 text-white '} rounded font-bold`}
          disabled={loading}
        >
          {loading ? 'Loading...' : note?.acceptedStatus ? 'Reject' : 'Accept'}
        </button>
      )}
    </div>
  );
};

export default ActionIcon;
