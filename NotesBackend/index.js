const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./db/connect");
const branchRoutes = require("./routes/branchRoutes");
const subRoutes = require("./routes/subRoutes");
const modRoutes = require("./routes/modRoutes");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const noteRoutes = require("./routes/noteRoutes");
const todoRoutes = require("./routes/todoRoutes");
const transferRoute = require("./routes/transfercoinsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const impDateRoutes = require("./routes/impDateRoutes");
const likeRoutes = require("./routes/likeRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const communityRoutes = require("./routes/communityRoutes");
const messageRoutes = require("./routes/messageRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const solveProblemRoutes = require("./routes/solvedproblemRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const meetRoutes = require("./routes/meetRoutes");
const urlRoutes = require("./routes/urlRoutes");
const { Server } = require("socket.io");
const cors = require("cors");
const { socketCtrl } = require("./controllers/socketCntrl");
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const { client, checkConnection } = require("./redis-client");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./utils/passport");
const books = require("./books.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Tesseract = require("tesseract.js");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: "v1beta",
});
const { Resumeupload } = require("./middlewares/upload");
const morgan = require("morgan");
const meetCntrl = require("./controllers/meetcntrl");
const path = require("path");
const fs = require("fs");
const FileDownloader = require("nodejs-file-downloader");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();

// Request logging middleware
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

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
app.use(cors());

app.use(bodyParser.json());

// Custom logging middleware for all requests
app.use((req, res, next) => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `${req.method} ${req.url} - ${res.statusCode}`
  );
  next();
});

connectDB(process.env.MONGO_URI);
let server = app.listen(port, () => {
  console.log("\x1b[32m%s\x1b[0m", `Server started on ${port}`);
  console.log("\x1b[32m%s\x1b[0m", `Mongo Connected MF!!!`);
});

checkConnection();

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

socketCtrl(io);

//use ejs to send the res on get request
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/books", async (req, res) => {
  const url = "https://pybitesbooks.com/users/bbelderbos";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const panes = $(".mui-tabs__pane");

    booksList = [];

    panes.each((index, pane) => {
      const readingDiv = $(pane);
      const books = readingDiv.find("a");

      books.each((index, book) => {
        const title = $(book).text().split("(")[0];
        const bookhref = $(book).attr("href") || null;
        const imgSrc = $(book).find("img").attr("src") || null;
        const author =
          $(book).find("span.hide").text().split("(")[1].replace(")", "") ||
          null;

        booksList.push({
          title,
          imgSrc,
          author,
          bookhref: `https://pybitesbooks.com${bookhref}`,
        });
      });
    });

    await client.set("books", JSON.stringify(booksList), "EX", 60 * 60 * 24);

    res.status(200).json({ books: booksList });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/scrapedata", async (req, res) => {
  try {
    const casheValue = await client.get("books");
    if (casheValue) {
      console.log("\x1b[36m%s\x1b[0m", "from cache");
      return res.status(200).json({ data: JSON.parse(casheValue) });
    }
    let numberOfPages = 83;
    let scrapedData = [];
    for (let i = 0; i < numberOfPages; i++) {
      const url = `https://www.freetechbooks.com/topics?page=${i}`;
      const response = await axios.get(url);

      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        $(".col-xs-12").each((index, element) => {
          const book = {};

          const headingElement = $(element).find(".media-heading a");
          book.href = headingElement.attr("href");
          book.title = headingElement.text().trim();
          book.description = $(element).find(".media-body p").text().trim();
          book.imageSrc = $(element).find("img.media-object").attr("src");
          scrapedData.push(book);
        });
      } else {
        console.error(
          "\x1b[31m%s\x1b[0m",
          `Failed to fetch the page ${url}. Status code: ${response.status}`
        );
      }
    }

    await client.set("books", JSON.stringify(scrapedData), "EX", 60 * 60 * 24);

    res.status(200).json({ data: scrapedData, qty: scrapedData.length });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/scrape", async (req, res) => {
  try {
    res.status(200).json({ data: books, qty: books.length });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this function before the route handler
function formatAIResponse(text) {
  try {
    // Check if the response is already in JSON format (wrapped in ```json)
    if (text.includes("```json")) {
      // Extract JSON string between ```json and ```
      const jsonStr = text.split("```json\n")[1].split("\n```")[0];
      const parsed = JSON.parse(jsonStr);
      return parsed;
    }

    // Fallback to original text parsing if not JSON
    const sections = text.split("\n\n");
    return {
      score: sections[0].split(":")[1]?.trim() || "N/A",
      strengths:
        sections[1]
          ?.split("\n")
          .filter((line) => line.startsWith("-"))
          .map((s) => s.replace("-", "").trim()) || [],
      improvements:
        sections[2]
          ?.split("\n")
          .filter((line) => line.startsWith("-"))
          .map((s) => s.replace("-", "").trim()) || [],
      recommendedSkills:
        sections[3]
          ?.split("\n")
          .filter((line) => line.match(/^\d/))
          .map((s) => {
            const [skill, explanation] = s
              .split("-")
              .map((part) => part.trim());
            return {
              skill: skill.replace(/^\d+\.\s*/, ""),
              explanation: explanation || "",
            };
          }) || [],
      recommendedCompanies:
        sections[4]
          ?.split("\n")
          .filter((line) => line.match(/^\d/))
          .map((s) => {
            const [company, reason] = s.split("-").map((part) => part.trim());
            return {
              company: company.replace(/^\d+\.\s*/, ""),
              reason: reason || "",
            };
          }) || [],
      actions:
        sections[5]
          ?.split("\n")
          .filter((line) => line.match(/^\d/))
          .map((s) => s.replace(/^\d+\.\s*/, "").trim()) || [],
    };
  } catch (error) {
    console.error("Error formatting AI response:", error);
    return { raw: text }; // Return raw text if formatting fails
  }
}

app.post("/ai-response", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text();
    // const formattedResponse = formatAIResponse(generatedText);
    res.json({ success: true, data: generatedText });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/summarize-pdf", async (req, res) => {
  try {
    const url = req.body.url;
    if (!url) {
      return res.status(400).json({ error: "PDF URL is required" });
    }

    const filePath = path.join(__dirname, "downloaded-file.pdf");

    // Function to download the file
    async function downloadFile(url, outputPath) {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    }

    // Download PDF
    await downloadFile(url, filePath);

    // Read the downloaded file
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const fileContent = pdfData.text;
    // Initialize Gemini AI model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prompt for summarization
    const prompt = `Summarize the following document:\n\n${fileContent}`;

    // Generate summary using Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Delete the file after processing
    fs.unlinkSync(filePath);

    // Respond with summary text
    res.json({ success: true, summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/generate-content",
  Resumeupload.single("resume"),
  async (req, res) => {
    try {
      const file = req.file;
      const geminiprompt = req.body.prompt;
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file",
        });
      }

      let fileContent;

      // Handle different file types
      if (file.mimetype === "text/plain") {
        fileContent = fs.readFileSync(file.path, "utf8");
      } else if (file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        fileContent = pdfData.text;
      } else if (file.mimetype.includes("word")) {
        const result = await mammoth.extractRawText({ path: file.path });
        fileContent = result.value;
      } else if (file.mimetype.includes("image")) {
        const tesseractResult = await Tesseract.recognize(file.path, "eng", {
          logger: (m) => console.log(m),
        });
        fileContent = tesseractResult.data.text;
      }

      if (!fileContent || fileContent.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from the uploaded file. Please ensure the file contains readable text.",
        });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      // Updated prompt for more structured response
      const prompt = `${geminiprompt} Here's the resume content: ${fileContent}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Clean up uploaded file after processing
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      const formattedResponse = formatAIResponse(generatedText);
      res.json({ success: true, data: formattedResponse });
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", error);
      // Clean up file in case of error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      res.status(500).json({
        success: false,
        message: "Error processing file: " + error.message,
      });
    }
  }
);

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/branch", branchRoutes);
app.use("/api/v1/sub", subRoutes);
app.use("/api/v1/mod", modRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/transfer", transferRoute);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/impDates", impDateRoutes);
app.use("/api/v1/skills", skillsRoutes);
app.use("/api/v1/community", communityRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/google", googleAuthRoutes);
app.use("/api/v1/solveProblem", solveProblemRoutes);
app.use("/api/v1/urls", urlRoutes);
app.use("/meet", meetRoutes);
meetCntrl(server);
app.use("/api/v1/pdf", pdfRoutes);

app.use(errorHandler);
