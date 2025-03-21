import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Setting";
import { getTodosByUserId, createTodo, updateTodo, deleteTodo } from "../redux/todo/todoActions";
import { useSelector, useDispatch } from 'react-redux';
import { fetchImpDates } from "../redux/impDates/impDateActions";
import ImpDatesCard from "../components/ImpDatesCard";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { BsCalendar3, BsCheckCircle, BsPlus } from 'react-icons/bs';

const Notification = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state?.todo?.todos) || [];
  const impDates = useSelector((state) => state?.impDate?.impDates);
  const [newTask, setNewTask] = useState("");
  const [localTodos, setLocalTodos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const response = await dispatch(createTodo({
      title: newTask,
    }));
    setNewTask("");
    if (response) {
      setLocalTodos([...localTodos, response]);
    }
  };

  const handleUpdate = async (id) => {
    await dispatch(updateTodo(id));
    setLocalTodos(localTodos.map(todo => 
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTodo(id));
    setLocalTodos(localTodos.filter(todo => todo._id !== id));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getTodosByUserId());
      dispatch(fetchImpDates());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  return (
    <Alternates>
      <div className="bg-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-8">My Planner</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Important Dates Section */}
            <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg">
              <div className="py-4 px-6 flex items-center justify-between border-b border-[#334155]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#3730a3]/20 flex items-center justify-center rounded-lg">
                    <BsCalendar3 className="text-[#818cf8] text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold">Important Dates</h2>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={prevMonth}
                    className="p-2 hover:bg-[#334155] rounded-lg"
                    aria-label="Previous month"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="mx-4 text-gray-300">{formatMonth(currentMonth)}</span>
                  <button 
                    onClick={nextMonth}
                    className="p-2 hover:bg-[#334155] rounded-lg"
                    aria-label="Next month"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {impDates?.length === 0 ? (
                  <div className="text-center py-8">
                    <BsCalendar3 className="mx-auto text-4xl text-gray-500 mb-3" />
                    <h2 className="text-xl font-semibold text-gray-400">No Important Dates</h2>
                    <p className="text-gray-500">You have no upcoming dates.</p>
                  </div>
                ) : (
                  <div>
                    {impDates?.map((imp) => <ImpDatesCard key={imp._id} imp={imp} />)}
                  </div>
                )}
              </div>
            </div>

            {/* Todo List Section */}
            <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg">
              <div className="py-4 px-6 flex items-center space-x-3 border-b border-[#334155]">
                <div className="w-10 h-10 bg-[#065f46]/20 flex items-center justify-center rounded-lg">
                  <BsCheckCircle className="text-[#34d399] text-xl" />
                </div>
                <h2 className="text-xl font-semibold">My Todo List</h2>
              </div>

              <div className="p-6">
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={newTask}
                    onChange={handleNewTaskChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(e)}
                    className="w-full py-3 pl-4 pr-14 bg-[#0f172a] border border-[#334155] rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Add a new task..."
                  />
                  <button
                    onClick={handleAddTask}
                    className="absolute right-1 top-1 bottom-1 w-12 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Add task"
                  >
                    <BsPlus className="text-white text-2xl" />
                  </button>
                </div>

                {localTodos?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#334155]">
                      <BsCheckCircle className="text-4xl text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-300">Your todo list is empty</h2>
                    <p className="text-gray-500 mt-2">Add your first task using the form above.</p>
                  </div>
                ) : (
                  <div>
                    {Array.isArray(localTodos) && localTodos?.map((task) => (
                      <div 
                        key={task._id}
                        className="flex items-center py-3 px-2 hover:bg-[#1e293b]/80 rounded-lg transition-colors duration-200 group"
                      >
                        <div 
                          onClick={() => handleUpdate(task._id)}
                          className={`w-6 h-6 flex-shrink-0 rounded-full border cursor-pointer flex items-center justify-center ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600 bg-transparent'}`}
                        >
                          {task.completed && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                            {task.title}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete task"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Alternates>
  );
};

export default Notification;
