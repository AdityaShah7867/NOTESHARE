import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import QuickFilter from '../components/QuickFilter';
import BookCardSkeletion from '../components/skeletons/BookCardSkeletion';
import Alternate from '../components/Layout/HomeLay';
import { getNotes, searchNote, getBookMarkedNotes } from '../redux/notes/noteActions';

const Home = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state?.note?.notes);
  const noteLoading = useSelector((state) => state.note.noteLoading);
  const user = useSelector((state) => state?.user?.user);
  const searchedNotes = useSelector((state) => state.note?.searchNote);
  const bookMarkedNotes = useSelector((state) => state.note.bookMarkNotes)

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [reRender, setreRender] = useState(false)

  // const filteredNotes = searchedNotes ? searchedNotes : notes;
  const filteredNotes = filter === 'BookMarked' ? bookMarkedNotes : searchedNotes && filter !== 'ALL' ? searchedNotes : notes;

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch, reRender]);

  useEffect(() => {
    if (search !== null) {
      dispatch(searchNote(search));
    }
  }, [dispatch, search]);

  useEffect(() => {
    console.log(filter)
    if (filter === 'BookMarked') {
      dispatch(getBookMarkedNotes());
    } else if (filter === 'ALL') {
      dispatch(getNotes());
    } else if (filter !== '') {
      dispatch(searchNote(filter));
    }
  }, [dispatch, filter, reRender]);

  return (
    <Alternate>
      <div className='w-full z-20 top-0 left-0 bg-gray-50 mt-5 ml-0 sm:ml-0 lg:-ml-16 min-h-screen mb-24'>
        <div className='container mx-auto'>
          <Search search={search} setSearch={setSearch} /><br />
          <QuickFilter filter={filter} setFilter={setFilter} />
          <div className=' justify-center'>
            {
              filter === 'BookMarked' ? <h1 className='text-black text-center text-2xl mb-10'>BookMarked Notes </h1> : null
            }
            </div>
            <div className='flex flex-wrap justify-center'>
            {
              filteredNotes?.length === 0 ? <h1 className='text-black text-2xl'>No Notes To Display</h1> : (
                noteLoading ? <BookCardSkeletion /> : (
                  filteredNotes?.length === 0 ? <h1 className='text-white text-2xl'>No Notes To Display</h1> : (
                    filteredNotes?.map((note, index) => (
                      <BookCard note={note} key={index} setreRender={setreRender} />
                    ))
                  )
                )
              )
            }
          </div>
        </div>
      </div>
    </Alternate>
  );
};

export default Home;
