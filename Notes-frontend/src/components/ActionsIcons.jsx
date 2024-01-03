import { GrView } from 'react-icons/gr'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { AcceptRejectNotes, getNotesAdmin, deleteNote } from '../redux/notes/noteActions';

const host = process.env.REACT_APP_API_HOST;


const ActionIcon = ({ icon, note, noteloading }) => {
  const dispatch = useDispatch();

  const HandleAcceptRejectNotes = (id) => async () => {
    await dispatch(AcceptRejectNotes(id));
    await dispatch(getNotesAdmin());
  };


  return (
    <div className="flex items-center space-x-2 cursor-pointer hover:text-purple-500 hover:scale-110">
      {icon === 'edit' && <GrView onClick={
        () => {
          if (note.acceptedStatus) {
            window.open(note.file + `#toolbar=0`)
          } else {
            window.open(`${host}/` + note.file)
          }

        }
      } />}
      {icon === 'delete' && <AiFillDelete
        onClick={async () => {
          await dispatch(deleteNote(note._id));
          await dispatch(getNotesAdmin());
        }}
      />}

      {icon === 'accept' && (
        <button
          onClick={HandleAcceptRejectNotes(note._id)}
          className={`px-2 py-1 ${!note?.acceptedStatus ? 'bg-green-500 text-white' : 'bg-red-600 text-white '
            } rounded font-bold`}
        >
          {note?.acceptedStatus ?
            noteloading ?
              'Loading...' :
              'Reject' : 'Accept'}
        </button>
      )}
    </div>
  );

}



export default ActionIcon