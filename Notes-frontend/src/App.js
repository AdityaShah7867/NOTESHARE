import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Nviewer from './pages/NoteViewer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoutes from './utils/PrivateRoutes';
import NotesForm from './pages/NotesForm';
import OtpForm from './pages/OtpForm';
import Communitychat from './pages/Communitychat';
import Navbar from './components/Navbar';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogedinUser } from './redux/auth/authActions';
import Profile from './pages/Profile';
import Landing from './pages/Landing';

import NotesTable from './pages/AdminPanel'
import SideBar from './components/Sidebar/Sidebar';
import Room from './pages/Room';
import Video from './pages/Video';
import Notification from './pages/Notification';
import Setting from './pages/Setting';
import DateForm from './pages/DateForm';
import Dashboard from './pages/DashBoard';
import { initialCall } from './redux/auth/authActions';
import Loader from './components/Loader';
import Ai from './pages/Ai';
import YourNotes from './pages/YourNotes';
import GrpChat from './pages/GrpChat';
import GetBooks from './pages/GetBooks';
import Chatbot from './components/AiBot/ChatBot';
import GameHomePage from './pages/GameHomePage';
import GamePage from './pages/GamePage';
import GameList from './pages/GameList';
import ResumeReview from './pages/ResumeReview';
import Addsubject from './pages/Addsubject';



const App = () => {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector((state) => state?.user?.isAuthenticated)
  const initialLoading = useSelector((state) => state?.user?.initialCallLoading)
  const user = useSelector((state) => state.user.user)
  let currentUrl = ''

  useEffect(() => {

    currentUrl = window.location.href;

    if (currentUrl.toLocaleLowerCase().includes('/room')) {
      console.log('room')
    }
    console.log('Current URL:', currentUrl);
  }, [window.location]);




  useEffect(() => {
    dispatch(getLogedinUser())
  }, [dispatch])


  useEffect(() => {
    dispatch(initialCall())
  }, [dispatch])


  if (initialLoading) {
    return (
      <Loader />
    )
  }





  return (
    <>

      <Router>
        <ToastContainer />
        {
          user ?
            <Chatbot /> : null
        }

        <div >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OtpForm />} />

            <Route
              path="/"
              element={
                <>
                  <div className="flex">
                    <SideBar />
                    <div className="flex-grow">
                      <PrivateRoutes />
                    </div>
                  </div>
                </>
              }
            >

              <Route path="/setting" element={<Setting />} />
              <Route path="/YourNotes" element={<YourNotes />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/home" element={<Home />} />
              <Route path="/notes" element={<NotesTable />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/video" element={<Video />} />
              <Route path="/addnotes" element={<NotesForm />} />
              <Route path="/admin" element={<NotesTable />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Communities" element={<Communitychat />} />
              <Route path="/DateForm" element={<DateForm />} />
              <Route path='/community-chat' element={<GrpChat />} />
              <Route path='/addsubject' element={<Addsubject />} />
              <Route path='/books' element={<GetBooks />} />
              <Route path='/gameslist' element={<GameList />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/resumeReview" element={<ResumeReview />} />




            </Route>



            <Route
              path="/"
              element={
                <>
                  <div className="flex">

                    <div className="flex-grow">
                      <ToastContainer />
                      <PrivateRoutes />
                    </div>
                  </div>
                </>
              }
            >
              <Route path="/nviewer/:noteId" element={<Nviewer />} />

              <Route path='/game' element={<GameHomePage />} />
              <Route path="/room/:username/:roomCode" element={<GamePage />} />
            </Route>


          </Routes>
        </div>
      </Router >
    </>
  );
}

export default App;
