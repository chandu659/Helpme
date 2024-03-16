import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Form from './schema.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"));

// Endpoint to handle form submission
app.post("/submit-form", async (req, res) => {
  const formData = req.body;
  try {
    const newFormEntry = new Form(formData);
    await newFormEntry.save();
    res.status(201).send("Form data saved successfully");
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).send("Error saving form data");
  }
});

app.listen(port, () => console.log(`Listening on localhost: ${port}`));
