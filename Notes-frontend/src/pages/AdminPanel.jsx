import React, { useEffect } from "react";
import { getNotesAdmin } from "../redux/notes/noteActions";
import { useDispatch, useSelector } from "react-redux";
import ActionIcon from "../components/ActionsIcons";
import AdminPanelSkeleton from "../components/skeletons/AdminPanelSkeleton";
import MainLayout from "../components/Layout/MainLayout";

const NotesTable = () => {
  const dispatch = useDispatch();
  const notesAdmin = useSelector((state) => state.note.notesAdmin);
  const noteAcceptStatusLoading = useSelector(
    (state) => state.note.noteAcceptStatusLoading
  );
  const user = useSelector((state) => state?.user?.user)
  useEffect(() => {
    dispatch(getNotesAdmin());
  }, [dispatch]);

  if (user?.role === 'user') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-gray-700">You are not authorized to view this page</h1>
        </div>
      </MainLayout>
    )

  }
  return (
    <MainLayout>


      <section className="antialiased  text-gray-600 h-screen px-4">
        <div className="flex flex-col mt-16">
          <div className="min-w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">ADMIN PANEL</h2>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Subject</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          Note Uploaded
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Coins</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Status</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Actons</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {notesAdmin?.length === 0 ? (
                      <>
                        <AdminPanelSkeleton />
                      </>
                    ) : (
                      notesAdmin?.map((note) => (
                        <tr>
                          <td className="p-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="max-w-6 max-h-6 flex-shrink-0 mr-2 sm:mr-3">
                                <img
                                  className="rounded-full w-6 h-6"
                                  src={`${process.env.REACT_APP_API_HOST}/`+note?.author?.profile}
                                  
                                  alt="Alex Shatov"
                                />
                              </div>
                              <div className="font-medium text-gray-800">
                                {note?.author?.username}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{note?.subject?.name || ""}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left font-medium text-green-500">
                              {note?.name}
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-lg text-center">{note?.author?.coins}</div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <span
                              className={`bg-${note?.acceptedStatus ? "green" : "red"
                                }-200 text-${note?.acceptedStatus ? "green" : "red"
                                }-600 py-1 px-3 rounded-full text-xs`}
                            >
                              {note?.acceptedStatus ? "Accepted" : "Not Accepted"}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex gap-4 item-center justify-center">
                              <ActionIcon icon="edit" note={note}

                              />
                              <ActionIcon icon="delete" note={note}

                              />
                              <ActionIcon
                                icon="accept"
                                status={note?.acceptedStatus}
                                note={note}
                                noteloading={noteAcceptStatusLoading}
                              />
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
      </section>
    </MainLayout>
  );
};

export default NotesTable;
