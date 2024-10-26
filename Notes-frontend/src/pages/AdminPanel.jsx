import React, { useEffect } from "react";
import { getNotesAdmin } from "../redux/notes/noteActions";
import { useDispatch, useSelector } from "react-redux";
import ActionIcon from "../components/ActionsIcons";
import AdminPanelSkeleton from "../components/skeletons/AdminPanelSkeleton";
import MainLayout from "../components/Layout/MainLayout";

const NotesTable = () => {
  const dispatch = useDispatch();
  const notesAdmin = useSelector((state) => state.note.notesAdmin);
  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    dispatch(getNotesAdmin());
  }, [dispatch]);

  if (user?.role === 'user') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center">
            <i className="fas fa-lock text-5xl text-red-500 mb-4"></i>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600">You are not authorized to view this page</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="antialiased  text-gray-600 min-h-screen p-4">
        <div className="flex flex-col mt-16">
          <div className="max-w-6xl mx-auto w-full">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <header className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-bold text-gray-800">ADMIN PANEL</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and monitor all notes</p>
              </header>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-4 text-left">Name</th>
                        <th className="px-4 py-4 text-left">Subject</th>
                        <th className="px-4 py-4 text-left">Note Uploaded</th>
                        <th className="px-4 py-4 text-center">Coins</th>
                        <th className="px-4 py-4 text-center">Status</th>
                        <th className="px-4 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {notesAdmin?.length === 0 ? (
                        <AdminPanelSkeleton />
                      ) : (
                        notesAdmin && notesAdmin.map((note) => (
                          <tr key={note._id} className="hover:bg-gray-50 transition duration-200">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 flex-shrink-0 mr-3">
                                  <img
                                    className="rounded-full w-full h-full object-cover border-2 border-gray-200"
                                    src={`${process.env.REACT_APP_API_HOST}/` + note?.author?.profile}
                                    alt="Profile"
                                  />
                                </div>
                                <div className="font-medium text-gray-800">
                                  {note?.author?.username}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600">
                              {note?.subject?.name || "N/A"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium text-blue-600">
                                {note?.name}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-center font-semibold text-gray-700">
                                {note?.author?.coins}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                note?.acceptedStatus 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {note?.acceptedStatus ? "Accepted" : "Not Accepted"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <ActionIcon icon="edit" note={note} />
                                <ActionIcon icon="delete" note={note} />
                                <ActionIcon icon="accept" note={note} />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotesTable;
