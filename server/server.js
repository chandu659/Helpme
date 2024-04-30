import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import Form from './schema.js'; 
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 8001; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
dotenv.config();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



// Redis client setup with direct connection 
const redisClient = createClient({
    host:'localhost',
    port:6379
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().catch(console.error);

// Define storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true }); 
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
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
app.use('/files', express.static(path.join(__dirname, 'uploads')));

//post data 
app.post('/submit-form', upload.single('FileData'), async (req, res) => {
  const { filename, path: filepath, mimetype } = req.file || {};
  const { Location, ...otherFields } = req.body;

  let parsedLocation = null;
  if (Location) {
    try {
      parsedLocation = JSON.parse(Location);
    } catch (error) {
      console.error('Error parsing location:', error);
    }
  }

  const formEntryData = {
    ...otherFields,
    FileData: { filename, filepath, mimetype },
    Location: parsedLocation,
  };

  try {
    const newFormEntry = new Form(formEntryData);
    await newFormEntry.save();
    res.status(201).send('Form data and file saved successfully');
  } catch (error) {
    console.error('Error saving form data and file:', error);
    res.status(500).send('Error saving form data and file');
  }
});



//cache search data
const cache = async (req, res, next) => {
  const pincode = req.query.pincode;
  const query = pincode ? { HelpType: 'education', Pincode: pincode } : { HelpType: 'education' };

  try {
    const cacheKey = JSON.stringify(query); 
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving from cache');
      return res.status(200).json(JSON.parse(cachedData));
    }
    res.locals.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error('Redis error:', error);
    next(); 
  }
};


//education
app.get('/education', cache, async (req, res) => {
  const { pincode } = req.query;
  let query = { HelpType: 'education' }; 

  if (pincode) {
      query.Pincode = pincode; 
  }

  try {
      const cacheKey = 'education_' + (pincode ? `pincode_${pincode}` : 'all');

      //Get cache from redis
      const cachedResults = await redisClient.get(cacheKey);
      if (cachedResults) {
          console.log('Serving from cache');
          return res.status(200).json(JSON.parse(cachedResults));
      }
      
      const entries = await Form.find(query);
      if (entries.length) {
          await redisClient.setEx(cacheKey, 120, JSON.stringify(entries));
          console.log('Cache miss - Data fetched from database and cached');
      }
      res.status(200).json(entries);
  } catch (error) {
      console.error('Error fetching education data:', error);
      res.status(500).send('Error fetching education data');
  }
});

// post comments in edu
app.post('/education/:id/comment', async (req, res) => {
  const { id } = req.params;
  const formEntry = await Form.findById(id);
  if (!formEntry) {
    return res.status(404).send('Entry not found');
  }
  formEntry.Comments.push(req.body);
  await formEntry.save();
  return res.status(201).json(formEntry.Comments.pop());  
});


// delete comments in edu
app.delete('/education/:postId/comment/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  const formEntry = await Form.findById(postId);
  if (!formEntry) {
    return res.status(404).send('Post not found');
  }
  const oldComments = formEntry.Comments.length;
  formEntry.Comments = formEntry.Comments.filter(comment => comment._id.toString() !== commentId);
  if (formEntry.Comments.length === oldComments) {
    return res.status(404).send('Comment not found');
  }
  await formEntry.save();
  return res.status(200).send('Comment deleted successfully');
});


// carpooling
app.get('/carpooling', cache, async (req, res) => {
  const { pincode } = req.query;
  let query = { HelpType: 'carpooling' }; 

  if (pincode) {
      query.Pincode = pincode; 
  }

  try {
      
      const cacheKey = 'carpooling_' + (pincode ? `pincode_${pincode}` : 'all');

      const cachedResults = await redisClient.get(cacheKey);
      if (cachedResults) {
          console.log('Serving from cache');
          return res.status(200).json(JSON.parse(cachedResults));
      }
      
      const entries = await Form.find(query);
      if (entries.length) {
          
          await redisClient.setEx(cacheKey, 120, JSON.stringify(entries));
          console.log('Cache miss - Data fetched from database and cached');
      }
      res.status(200).json(entries);
  } catch (error) {
      console.error("Error fetching education data:", error);
      res.status(500).send("Error fetching education data");
  }
});

//post comment in carpooling  form
app.post('/carpooling/:id/comment', async (req, res) => {
  try {
    const formEntry = await Form.findById(req.params.id);

    if (!formEntry) {
      return res.status(404).send('Entry not found');
    }

    
    formEntry.Comments.push(req.body);
    
    await formEntry.save();
    res.status(201).send('Comment added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding comment');
  }
});


// delete the comments in carpooling section
app.delete('/carpooling/:postId/comment/:commentId', async (req, res) => {
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


//get filename
app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filepath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(filepath);
  } else {
    res.status(404).send("File not found");
  }
});

//soket.io implementation
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); 
  });
});




server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
