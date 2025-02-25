import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fadeIn } from '../Variants';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import QuickFilter from '../components/QuickFilter';
import BookCardSkeletion from '../components/skeletons/BookCardSkeletion';
import Alternate from '../components/Layout/HomeLay';
import { getNotes, searchNote, getBookMarkedNotes, getInitialNotes } from '../redux/notes/noteActions';
import { BsGrid, BsList } from 'react-icons/bs';

const Home = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state?.note?.notes);
  const noteLoading = useSelector((state) => state.note.noteLoading);
  const user = useSelector((state) => state?.user?.user);
  const searchedNotes = useSelector((state) => state.note?.searchNote);
  const bookMarkedNotes = useSelector((state) => state.note.bookMarkNotes)

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [reRender, setreRender] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // const filteredNotes = searchedNotes ? searchedNotes : notes;
  let  filteredNotes= filter === 'BookMarked' ? bookMarkedNotes : searchedNotes && filter !== 'ALL' ? searchedNotes : notes;



  useEffect(() => {
    // dispatch(getNotes());
    dispatch(getInitialNotes())
  }, [dispatch, reRender]);

  useEffect(() => {
    if (search !== null) {
      dispatch(searchNote(search));
    }
  }, [dispatch, search]);

  useEffect(() => {
    if (filter === 'BookMarked') {
      console.log('Bookmarked')
      dispatch(getBookMarkedNotes());
    } else if (filter === 'ALL') {
   
      dispatch(getNotes());
    } else if (filter !== '') {
      dispatch(searchNote(filter));
    }
  }, [dispatch, filter, reRender]);

  return (
    <Alternate>
      <div className='w-full z-20 top-0 left-0 bg-gray-100 mt-5 ml-0 sm:ml-0 lg:-ml-16 min-h-screen mb-24'>
        <div className='container mx-auto'>
          {/* Search bar without toggle button */}
          <div className='flex justify-center items-center mb-4'>
            <Search search={search} setSearch={setSearch} />
          </div>

          {/* QuickFilter with toggle button below */}
          <div className='mb-4 flex items-center'>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className='p-2  rounded-lg bg-blue-400 text-white shadow hover:bg-blue-500'
            >
              {viewMode === 'grid' ? <div className='flex items-center gap-2'><BsList size={24} /> List</div> : <div className='flex items-center gap-2'><BsGrid size={24} /> Grid</div>}
            </button>
            <div className='w-full'>
              <QuickFilter filter={filter} setFilter={setFilter} />
            </div>
            <div className='flex justify-center mt-3'>

            </div>
          </div>
          <div className=' justify-center'>
            {
              filter === 'BookMarked' ? <h1 className='text-black text-center text-2xl mb-10'> </h1> : null
            }
          </div>
          <motion.div
            className={`flex ${viewMode === 'grid' ? 'flex-wrap justify-center' : 'flex-col gap-4'}`}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn('up', 0.3)}>
            {
              filteredNotes?.length === 0 ? <h1 className='text-black text-2xl'>No Notes To Display</h1> : (
                noteLoading ? <BookCardSkeletion /> : (
                  filteredNotes?.length === 0 ? <h1 className='text-white text-2xl'>No Notes To Display</h1> : (
                    viewMode === 'list' ? (
                      <ResponsiveListView notes={filteredNotes} setreRender={setreRender} viewMode={viewMode} />
                    ) : (
                      // Grid view
                      filteredNotes.map(note => (
                        <BookCard 
                          key={note._id} 
                          note={note} 
                          setreRender={setreRender} 
                          viewMode={viewMode} 
                        />
                      ))
                    )
                  )
                )
              )
            }
          </motion.div>
        </div>
      </div>
    </Alternate>
  );
};

// New responsive design for list view
const ResponsiveListView = ({ notes, setreRender, viewMode }) => {
  return (
    <div className="w-full flex flex-col gap-4 items-center">
      {notes.map(note => (
        <div 
          key={note._id} 
          className="w-full max-w-7xl bg-white border rounded-lg shadow p-4"
        >
          <BookCard 
            note={note} 
            setreRender={setreRender} 
            viewMode={viewMode} 
          />
        </div>
      ))}
    </div>
  );
};


export default Home;
