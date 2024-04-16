import mongoose from 'mongoose';

const FileDataSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  mimetype: String
});

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
});

const FormSchema = new mongoose.Schema({
  Pincode: Number,
  City: String,
  State: String,
  HelpType: String,
  Subject: String,
  Description: String,
  Comments: [CommentSchema], // This defines Comments as an array of CommentSchema
  Location: {
    latitude:Number,
    longitude:Number,
  },
  FileData: FileDataSchema
});

const Form = mongoose.model('Form', FormSchema);

export default Form;
