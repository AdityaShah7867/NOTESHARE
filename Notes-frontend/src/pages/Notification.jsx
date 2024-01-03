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

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await dispatch(createTodo({
      title: newTask,
    }));

    setNewTask("");
    await dispatch(getTodosByUserId());
  };

  const handleUpdate = async (id) => {
    await dispatch(updateTodo(id));
    await dispatch(getTodosByUserId());
  };

  useEffect(() => {
    dispatch(getTodosByUserId());
    dispatch(fetchImpDates());
  }, [dispatch]);

  return (
    <Alternates>
      <div className="mt-9  "></div>
      <div className="flex flex-col md:flex-row">



        <motion.div className="flex flex-col-reverse mt-9 justify-end"
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn('right', 0.3)}>
          {impDates?.length === 0 && <h1 className="text-2xl mt-3 text-red-500">No Important Dates Found</h1>}


          {impDates?.map((imp) => (

            <ImpDatesCard imp={imp} />

          ))}
          <h1 className="text-3xl font-bold mb-4 ml-4">Important Dates</h1>
        </motion.div>

        <motion.div className="xl:w-2/4 border-2 mx-auto mt-9"
          initial='hidden'
          whileInView={'show'}
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn('left', 0.3)}>
          <div className="container border-2 bg-white rounded-xl overflow-hidden shadow-lg mx-auto p-4 text-center">
            <h1 className="text-3xl font-bold mb-4">My To-Do List</h1>
            <form onSubmit={handleAddTask}>
              <div className="flex space-x-2 mb-4">
                <input
                  id="task"
                  className="flex-1 border rounded py-2 px-3"
                  type="text"
                  placeholder="Add a new task..."
                  onChange={handleNewTaskChange}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>
            <ul id="taskList">
              {todos?.length === 0 && <h1 className="text-2xl text-red-500">No Task Found</h1>}

              {todos?.length !== 0 && Array.isArray(todos) && todos?.map((task, index) => (
                <li key={index} className="flex items-center justify-between border-b border-gray-300 py-2">
                  <div className="flex items-center space-x-2 w-4/5">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      id={`complete-${index}`}
                      checked={task.completed}
                      onClick={() => { handleUpdate(task._id); }}
                    />
                    <div className="text-left">
                      <label
                        htmlFor={`complete-${index}`}
                        className={task.completed ? "line-through text-lg text-green-500" : "text-lg"}
                      >
                        {task.title}
                      </label>
                      <h1>{new Date(task.createdAt).toLocaleTimeString()}</h1>
                    </div>
                  </div>
                  <div>
                    <button
                      className="text-white border-2 bg-red-500 rounded-md border-red-500 p-1 ml-1 hover:bg-red-600"
                      onClick={async () => {
                        await dispatch(deleteTodo(task?._id));
                        await dispatch(getTodosByUserId());
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </Alternates>
  );
};

export default Notification;
