const express = require('express');
const router = express.Router();
const {
    getTodo,
    updateTodo,
    deleteTodo,
    getTodosByUserID,
    AddTodo
} = require('../controllers/todoCntrl');
const validateToken = require('../middlewares/validateToken');



//add todo post req with middleware
router.route('/addTodo').post(validateToken, AddTodo);

//to delete an  todo
router.route('/delete/:todoID').delete(validateToken, deleteTodo);

//to update an todo
router.route('/update/:todoID').put(validateToken, updateTodo);

//to get an todo
router.route('/getTodo').get(validateToken, getTodo);

//to get all todos of a user
router.route('/getTodoByUserId').get(validateToken, getTodosByUserID);


module.exports = router;
