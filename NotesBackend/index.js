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
const communityRoutes = require('./routes/communityRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { Server } = require('socket.io')
const cors = require('cors');
const { socketCtrl } = require("./controllers/socketCntrl");
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');




const app = express();

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors())

app.use(bodyParser.json())

connectDB(process.env.MONGO_URI);
let server = app.listen(port, () => {
    console.log(`Server started on ${port}`)
    console.log(`Mongo Connected MF!!!`)
});


const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    },
});

socketCtrl(io);

//use ejs to send the res on get request
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/books', async (req, res) => {
    const url = 'https://pybitesbooks.com/users/bbelderbos';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const panes = $('.mui-tabs__pane');

        booksList = [];

        panes.each((index, pane) => {
            const readingDiv = $(pane);
            const books = readingDiv.find('a');
            console.log('books', books[0])

            books.each((index, book) => {
                const title = $(book).text().split('(')[0];
                const bookhref = $(book).attr('href') || null;
                const imgSrc = $(book).find('img').attr('src') || null;
                const author = $(book).find('span.hide').text().split('(')[1].replace(')', '') || null;


                booksList.push({ title, imgSrc, author, bookhref: `https://pybitesbooks.com${bookhref}` });
            });
        });

        res.status(200).json({ books: booksList });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


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
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(errorHandler);

