// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const url = "mongodb+srv://mbasit467:malik467@cluster0.0p5hn88.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(url).then(() => console.log("Connected to Database"))
  .catch((error) => console.log("Database connection error:", error));

// Define Schema and Model if needed

// Define Routes
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

// Example Route for interacting with MongoDB
app.post('/api/data', (req, res) => {
    // Example: Saving data to MongoDB
    // const newData = new DataModel(req.body);
    // newData.save()
    //     .then(() => res.json({ message: 'Data saved successfully' }))
    //     .catch((error) => res.status(400).json({ error: error.message }));
});

// Start the server
app.listen(3000);
