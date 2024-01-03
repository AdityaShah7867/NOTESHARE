const express = require("express");
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require("./db/connect");
const branchRoutes = require('./routes/branchRoutes');
const subRoutes = require('./routes/subRoutes');
const modRoutes = require('./routes/modRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/noteRoutes');
const todoRoutes = require('./routes/todoRoutes');
const transferRoute = require('./routes/transfercoinsRoutes')
const commentRoutes = require('./routes/commentRoutes')
const impDateRoutes = require('./routes/impDateRoutes')
const likeRoutes = require('./routes/likeRoutes')
const skillsRoutes = require('./routes/skillsRoutes')
const cors = require('cors');
require('dotenv').config();



const app = express();

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors())

app.use(bodyParser.json())
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server started on ${port}`)
            console.log(`Mongo Connected MF!!!`)
        });
    } catch (err) {
        console.log(err);
    }
};

//use ejs to send the res on get request
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
})

app.use('/uploads', express.static('uploads'));
app.use('/api/v1/branch', branchRoutes);
app.use('/api/v1/sub', subRoutes);
app.use('/api/v1/mod', modRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/transfer', transferRoute);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/impDates', impDateRoutes);
app.use('/api/v1/skills', skillsRoutes);
app.use(errorHandler);
start();

