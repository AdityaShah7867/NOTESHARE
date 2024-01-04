import React, { useEffect, useState } from 'react';
import '../nviewer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getSingleNote } from '../redux/notes/noteActions';
import Comments from '../components/Comments';
import Alternates from "../components/Layout/Nviewer"
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { bookMarkNotes } from '../redux/notes/noteActions';

const Nviewer = () => {

  const user = useSelector((state) => state?.user?.user)
  const [loader, setloader] = useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noteId } = useParams();
  const singlenote = useSelector((state) => state?.note?.singlenote)

  useEffect(() => {
    const loading = setTimeout(() => {
      setloader(false)
    }, 2000);
    dispatch(getSingleNote(
      noteId
    ))
    return () => {
      clearTimeout(loading)
    }
  }, [dispatch])


  if (!loader) {
    if (!singlenote?.purchased?.includes(user?._id)) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">You have not purchased this note</h1>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
                onClick={() => navigate('/')}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )
    }

  }

  if (loader) {
    return (
      <>
        <Loader />
      </>
    )
  }



  return (

    <div className="lg:flex md:flex-row -mt-16" style={{ color: 'white' }}>
      <div className="lg:w-2/3 sm:w-full md:w-full bg-lightgray p-4">
        <h1 className="text-3xl font-bold mt-16 text-left">{singlenote?.name} </h1>
        <h3 className="text-3xl font-bold text-left">-by {singlenote?.author?.username}</h3>

        <iframe
          className="iframe mt-10 sm:min-w-full h-[35rem] lg:h-[50rem]"
          src={singlenote?.file + `#toolbar=0`}
          width="100%"

        ></iframe>
      </div>
      <div className="lg:w-1/3 md:w-full bg-darkgray p-4 mt-10">
        <div className="flex">


          <button
            onClick={
              () => {
                dispatch(bookMarkNotes(singlenote?._id))

              }
            }
            className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
          >
            <i class="fa-regular fa-bookmark fa-2xl"></i>

          </button>

          <br />

          <button
            type="submit"
            className="text-red-700 border h-14 mx-2 border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500"
          >
            <i className="fa-regular fa-heart fa-2xl mx-2"></i>

          </button>
        </div>
        <Comments note={singlenote} />
      </div>
    </div>


  );
}

export default Nviewer;
