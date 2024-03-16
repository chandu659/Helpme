import mongoose from 'mongoose';

const FormSchema = mongoose.Schema({
    Pincode: Number,
    City:String,
    State:String,
    HelpType:String,
    Subject:String,
    Description:String,
    Comments:String
});

// Create a model from the schema
const Form = mongoose.model('Form', FormSchema);

export default Form;
