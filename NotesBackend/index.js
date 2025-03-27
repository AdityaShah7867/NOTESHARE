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
const googleAuthRoutes=require('./routes/googleAuthRoutes')
const solveProblemRoutes = require('./routes/solvedproblemRoutes');
const pdfRoutes = require('./routes/pdfRoutes')
const urlRoutes = require('./routes/urlRoutes')
const reportRoutes = require('./routes/reportRoutes')
const { Server } = require('socket.io')
const cors = require('cors');
const { socketCtrl } = require("./controllers/socketCntrl");
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { client, checkConnection } = require('./redis-client')
const passport=require('passport')
const cookieSession = require("cookie-session");
const passportStrategy = require('./utils/passport');
const books=require('./books.json')
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Tesseract = require('tesseract.js');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const {Resumeupload}=require('./middlewares/upload')
const morgan = require('morgan')

const app = express();

// Request logging middleware
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());


const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors())

app.use(bodyParser.json())

// Custom logging middleware for all requests
app.use((req, res, next) => {
    console.log('\x1b[36m%s\x1b[0m', `${req.method} ${req.url} - ${res.statusCode}`);
    next();
});

connectDB(process.env.MONGO_URI);
let server = app.listen(port, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server started on ${port}`)
    console.log('\x1b[32m%s\x1b[0m', `Mongo Connected MF!!!`)
});

checkConnection();


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

            books.each((index, book) => {
                const title = $(book).text().split('(')[0];
                const bookhref = $(book).attr('href') || null;
                const imgSrc = $(book).find('img').attr('src') || null;
                const author = $(book).find('span.hide').text().split('(')[1].replace(')', '') || null;


                booksList.push({ title, imgSrc, author, bookhref: `https://pybitesbooks.com${bookhref}` });
            });
        });

        await client.set('books', JSON.stringify(booksList), 'EX', 60 * 60 * 24);

        res.status(200).json({ books: booksList });
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/scrapedata', async (req, res) => {
    try {
        const casheValue = await client.get('books')
        if (casheValue) {
            console.log('\x1b[36m%s\x1b[0m', 'from cache')
            return res.status(200).json({ data: JSON.parse(casheValue) });
        }
        let numberOfPages = 83;
        let scrapedData = [];
        for (let i = 0; i < numberOfPages; i++) {
            const url = `https://www.freetechbooks.com/topics?page=${i}`;
            const response = await axios.get(url);

            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                $('.col-xs-12').each((index, element) => {
                    const book = {};

                    const headingElement = $(element).find('.media-heading a');
                    book.href = headingElement.attr('href');
                    book.title = headingElement.text().trim();
                    book.description = $(element).find('.media-body p').text().trim();
                    book.imageSrc = $(element).find('img.media-object').attr('src');
                    scrapedData.push(book);
                });
            } else {
                console.error('\x1b[31m%s\x1b[0m', `Failed to fetch the page ${url}. Status code: ${response.status}`);
            }
        }

        await client.set('books', JSON.stringify(scrapedData), 'EX', 60 * 60 * 24);


        res.status(200).json({ data: scrapedData, qty: scrapedData.length });
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/scrape', async (req, res) => {
    try {
        res.status(200).json({ data: books, qty: books.length });
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

app.post('/generate-content',Resumeupload.single('resume') ,async (req, res) => {
    try {
        const file=req.file;
        const imageData = `./uploads/${file.filename}`
       
        const tesseractResult = await Tesseract.recognize(imageData, 'eng');
        const text = tesseractResult.data.text;

        if (text.length > 0) {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = ` ${text} This is data of my resume and rate it out of 10. and recommend me the skills i should learn to improve my resume
            and for which companies i should apply according to my resume and my skills give a formmated response`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const generatedText = await response.text();

            res.json({ success: true, generatedText });
        } else {
            res.json({ success: false, message: 'No text found in the image' });
        }
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
app.use('/api/v1/google',googleAuthRoutes)
app.use('/api/v1/solveProblem', solveProblemRoutes);
app.use('/api/v1/urls', urlRoutes);
app.use('/api/v1/report', reportRoutes);
app.use('/api/v1/pdf',pdfRoutes)

app.use(errorHandler);
