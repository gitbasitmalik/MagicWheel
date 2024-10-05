import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router/routes.js'; // Assuming this is your router setup
import multer from 'multer';

const app = express();
const url = "mongodb+srv://mbasit467:malik467@cluster0.0p5hn88.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Multer storage configuration
const upload = multer({ dest: 'uploads/' });

// Apply multer middleware to handle file uploads
app.use(upload.single('image')); // Assuming 'image' is the field name for the uploaded file

// MongoDB Connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to Database");
}).catch((error) => {
  console.log("Database connection error:", error);
});

// Routes
app.use("/", router); // Assuming your router handles all endpoints

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
