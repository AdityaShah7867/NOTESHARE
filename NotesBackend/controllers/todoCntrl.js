const Todo = require('../models/todoModel');
const mongoose = require('mongoose');
const { User } = require('../models/userModel');

const AddTodo = async (req, res) => {
    const { title } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const newTodo = new Todo({
            user: req.user.id,
            title,

        });

        await newTodo.save();
        user.todos.push(newTodo._id);
        await user.save();

        res.status(200).json({ message: "Todo added successfully", newTodo });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const getTodo = async (req, res) => {
    try {
        const Todos = await Todo.find();
        res.status(200).json({ message: "Fetched the todos successfully", Todos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTodosByUserID = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const todos = await Todo.find({ user: user }).sort({ createdAt: -1 })
        res.status(200).json({ message: "Fetched the todos successfully", todos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTodo = async (req, res) => {
    const { todoID } = req.params;

    try {
        const todo = await Todo.findById(todoID);
        if (!todo) {
            return res.status(400).json({ error: "Todo does not exist" });
        }


        const updatedFields = {};
        const todoCompleted = todo.completed;


        updatedFields.completed = !todoCompleted;

        const newTodo = await Todo.findByIdAndUpdate(todoID, updatedFields, { new: true });
        res.status(200).json({ message: `todo ${newTodo.completed ? `completed` : `unSelected`} succesfully`, newTodo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTodo = async (req, res) => {
    const { todoID } = req.params;
    try {
        const todo = await Todo.findById(todoID);
        if (!todo) {
            return res.status(400).json({ error: "Todo does not exist" });
        }
        await Todo.findByIdAndDelete(todoID);
        res.status(200).json({ message: "Todo deleted successfully", todo: todo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { AddTodo, getTodo, getTodosByUserID, updateTodo, deleteTodo };
