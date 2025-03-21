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

  let filteredNotes = filter === 'BookMarked' ? bookMarkedNotes : searchedNotes && filter !== 'ALL' ? searchedNotes : notes;

  useEffect(() => {
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <Alternate>
      <div className='bg-gray-900 min-h-screen text-gray-100 py-6 px-4 md:px-6 lg:px-8 ml-0 sm:ml-0 lg:-ml-16 mb-24'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2'>
              Discover Notes
            </h1>
            <p className='text-gray-400'>
              Find and share quality notes with the community
            </p>
          </div>

          {/* Search and View Toggle */}
          <div className='flex flex-col md:flex-row gap-4 mb-6 items-center'>
            <div className='flex-grow'>
              <Search search={search} setSearch={setSearch} />
            </div>
            <div className='md:w-auto w-full'>
              <button
                onClick={toggleViewMode}
                className='px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 w-full'
                aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                {viewMode === 'grid' 
                  ? <><BsList size={20} className="flex-shrink-0" /> <span className="whitespace-nowrap">List View</span></> 
                  : <><BsGrid size={20} className="flex-shrink-0" /> <span className="whitespace-nowrap">Grid View</span></>
                }
              </button>
            </div>
          </div>

          {/* Filter section */}
          <div className='mb-8'>
            <QuickFilter filter={filter} setFilter={setFilter} />
          </div>

          {/* Notes display */}
          {filter === 'BookMarked' && bookMarkedNotes?.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-xl font-semibold text-blue-400 flex items-center gap-2'>
                <i className='bi bi-bookmark-fill'></i> Bookmarked Notes
              </h2>
            </div>
          )}

          {noteLoading ? (
            <div className='py-8'>
              <BookCardSkeletion />
            </div>
          ) : filteredNotes?.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md'>
                <i className='bi bi-search text-5xl text-gray-500 mb-4'></i>
                <h2 className='text-2xl font-bold text-gray-300 mb-2'>No Notes Found</h2>
                <p className='text-gray-400'>
                  We couldn't find any notes matching your criteria. Try adjusting your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
              }
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn('up', 0.3)}
            >
              {viewMode === 'list' ? (
                <div className='w-full bg-gray-800 rounded-xl overflow-hidden shadow-xl'>
                  <div className='hidden md:flex bg-gray-700 text-gray-300 text-sm font-medium'>
                    <div className='w-[50%] py-3 px-4'>NOTE</div>
                    <div className='w-[20%] py-3 px-4'>AUTHOR</div>
                    <div className='w-[15%] py-3 px-4'>ACTIVITY</div>
                    <div className='w-[15%] py-3 px-4'>ACTIONS</div>
                  </div>
                  <div className='divide-y divide-gray-700'>
                    {filteredNotes.map(note => (
                      <BookCard 
                        key={note._id} 
                        note={note} 
                        setreRender={setreRender} 
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <BookCard 
                    key={note._id} 
                    note={note} 
                    setreRender={setreRender} 
                    viewMode={viewMode}
                  />
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Alternate>
  );
};

export default Home;
