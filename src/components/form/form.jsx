import React,{useState} from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import './form.css'; 
import axios from 'axios';

const CustomForm = () => {

  //Initialize the form data
  const [formData, setFormData] = useState({
    Pincode: '',
    City: '',
    State: '',
    HelpType: '',
    Subject: '',
    Description: '',
    
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send POST request to backend
      await axios.post('http://localhost:8001/submit-form', formData);
      alert('Form submitted successfully!');
      // Optionally reset form fields here
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };

  return (
    <Form className="custom-form" onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridPincode">
          <Form.Label>Pincode</Form.Label>
          <Form.Control 
          type="text"
          placeholder="Enter pincode"
          id ="Pincode"
          value={formData.Pincode}
          onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control 
          type="text" 
          placeholder="City" 
          id ="City"
          value={formData.City}
          onChange={handleChange}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Control 
          type="text" 
          placeholder="State"
          id="State"
          value={formData.State}
          onChange={handleChange}> 
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridHelpType">
        <Form.Label>Help Type</Form.Label>
        <Form.Control as="select" 
        defaultValue="Choose..."
        id="HelpType"
        value={formData.HelpType}
        onChange={handleChange}>
          <option>Choose...</option>
          <option value="education">Education Help</option>
          <option value="carpooling">Carpooling Help</option>
        </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Group controlId="formGridSubject">
        <Form.Label>Subject</Form.Label>
        <Form.Control 
        placeholder="Subject of your query or issue"
        type="text"
        id="Subject"
        value={formData.Subject}
        onChange={handleChange}
         />
      </Form.Group>

      <Form.Group controlId="formGridDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control 
        as="textarea" 
        rows={3}
        placeholder="Detailed description" 
        id="Description"
        value={formData.Description}
        onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.File controlId="formFileUpload" label="File Upload" />
      </Form.Group>

      <Form.Group controlId="formGridShareLocation">
        <Form.Check type="checkbox" label="Share location" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default CustomForm;
