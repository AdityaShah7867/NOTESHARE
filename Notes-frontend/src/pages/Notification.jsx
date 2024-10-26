import React, { useEffect, useState } from "react";
import Alternates from "../components/Layout/Setting";
import { motion } from 'framer-motion';
import { fadeIn } from '../Variants';
import { getTodosByUserId, createTodo, updateTodo, deleteTodo } from "../redux/todo/todoActions";
import { useSelector, useDispatch } from 'react-redux';
import { fetchImpDates } from "../redux/impDates/impDateActions";
import ImpDatesCard from "../components/ImpDatesCard";

const Notification = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state?.todo?.todos) || [];
  const impDates = useSelector((state) => state?.impDate?.impDates);
  const [newTask, setNewTask] = useState("");
  const [localTodos, setLocalTodos] = useState([]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Important Dates Section */}
          <motion.div 
            className="lg:w-1/2"
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn('right', 0.3)}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
                Important Dates
              </h1>
              <div className="space-y-4">
                {impDates?.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="far fa-calendar-times text-4xl text-red-400 mb-3"></i>
                    <h2 className="text-xl font-semibold text-red-500">No Important Dates Found</h2>
                  </div>
                ) : (
                  impDates?.map((imp) => <ImpDatesCard key={imp._id} imp={imp} />)
                )}
              </div>
            </div>
          </motion.div>

          {/* Todo List Section */}
          <motion.div 
            className="lg:w-1/2"
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn('left', 0.3)}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">My To-Do List</h1>
              
              <form onSubmit={handleAddTask} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={handleNewTaskChange}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Add a new task..."
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <i className="bi bi-plus-circle"></i>
                    Add
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {localTodos?.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="far fa-clipboard text-4xl text-gray-400 mb-3"></i>
                    <h2 className="text-xl font-semibold text-gray-600">No Tasks Found</h2>
                    <p className="text-gray-500">Add your first task above!</p>
                  </div>
                ) : (
                  Array.isArray(localTodos) && localTodos?.map((task, index) => (
                    <div 
                      key={task._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleUpdate(task._id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(task.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Alternates>
  );
};

export default Notification;
