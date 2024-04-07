import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Form from './schema.js'; // Make sure this path is correct
import path from 'path'; // Import path module
import fs from 'fs'; // Import fs module
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true }); // Ensure the uploads directory exists
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use Date.now() to make filenames unique
  }
});

const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); 

app.post('/submit-form', upload.single('FileData'), async (req, res) => {
  const { filename, path: filepath, mimetype } = req.file || {};
  const formEntryData = { ...req.body, FileData: { filename, filepath, mimetype } };
  console.log(req.file); // chek the file info
  console.log(req.body); // check the non-file form data

  try {
    const newFormEntry = new Form(formEntryData);
    await newFormEntry.save();
    res.status(201).send('Form data and file saved successfully');
  } catch (error) {
    console.error('Error saving form data and file:', error);
    res.status(500).send('Error saving form data and file');
  }
});

// Serving file
app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filepath, err => {
    if (err) {
      console.error("Error sending file:", err);
      if (!res.headersSent) {
        res.status(500).send("Error fetching file");
      }
    }
  });
});

// get education 
app.get("/education", async (req, res) => {
  try {
    const entries = await Form.find({ HelpType: 'education' });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching education data:", error);
    res.status(500).send("Error fetching education data");
  }
});

// comment section
app.post('/education/:id/comment', async (req, res) => {
  try {
    const formEntry = await Form.findById(req.params.id);

    if (!formEntry) {
      return res.status(404).send('Entry not found');
    }

    // Push a new comment into the Comments array
    formEntry.Comments.push(req.body);
    
    await formEntry.save();
    res.status(201).send('Comment added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding comment');
  }
});

// delete the comments 
app.delete('/education/:postId/comment/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const formEntry = await Form.findById(postId);

    if (!formEntry) {
      return res.status(404).send('Post not found');
    }

    formEntry.Comments = formEntry.Comments.filter(comment => comment._id.toString() !== commentId);

    await formEntry.save();
    res.status(200).send('Comment deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting comment');
  }
});


// get carpooling
app.get("/carpooling", async (req, res) => {
  try {
    const entries = await Form.find({ HelpType:'carpooling' });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching carpooling data:", error);
    res.status(500).send("Error fetching carpooling data");
  }
});


app.listen(port, () => console.log(`Listening on localhost: ${port}`));
