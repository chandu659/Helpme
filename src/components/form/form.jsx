import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import './form.css';

const CustomForm = () => {
  const initialFormState = {
    Pincode: '',
    City: '',
    State: '',
    HelpType: 'Choose...',
    Subject: '',
    Description: '',
    Location: null, 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [shareLocation, setShareLocation] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLocationChange = (e) => {
    const { checked } = e.target;
    setShareLocation(checked);
    if (checked) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            Location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error('Error obtaining location:', error);
          alert('Could not retrieve your location. Please ensure you have given permission.');
          setShareLocation(false); // Reset if location permission is denied
        }
      );
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Location: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'Location' && formData[key] !== null) {
        submissionData.append(key, JSON.stringify(formData[key]));
      } else {
        submissionData.append(key, formData[key]);
      }
    });
  
    if (file) {
      submissionData.append('FileData', file);
    }
  
    try {
      const response = await axios.post('http://localhost:8001/submit-form', submissionData);
      console.log('Form submitted:', response.data);
      alert('Form submitted successfully!');
      setFormData(initialFormState); 
      setFile(null);
      setShareLocation(false); // Uncheck location sharing
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };
  
  return (
    <Form className="custom-form" onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="Pincode">
          <Form.Label>Pincode</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter pincode" 
            value={formData.Pincode} 
            onChange={handleChange} 
          />
        </Form.Group>
  
        <Form.Group as={Col} controlId="City">
          <Form.Label>City</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter city" 
            value={formData.City} 
            onChange={handleChange} 
          />
        </Form.Group>
  
        <Form.Group as={Col} controlId="State">
          <Form.Label>State</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter state" 
            value={formData.State} 
            onChange={handleChange} 
          />
        </Form.Group>
  
        <Form.Group as={Col} controlId="HelpType">
          <Form.Label>Help Type</Form.Label>
          <Form.Control 
            as="select" 
            value={formData.HelpType} 
            onChange={handleChange}>
            <option>Choose...</option>
            <option value="education">Education Help</option>
            <option value="carpooling">Carpooling Help</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
  
      <Form.Group controlId="Subject">
        <Form.Label>Subject</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter subject" 
          value={formData.Subject} 
          onChange={handleChange} 
        />
      </Form.Group>
  
      <Form.Group controlId="Description">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          placeholder="Enter description" 
          value={formData.Description} 
          onChange={handleChange} 
        />
      </Form.Group>
  
      <Form.Group controlId="formFileUpload">
        <Form.Label>File Upload</Form.Label>
        <Form.File 
          onChange={handleFileChange} 
        />
      </Form.Group>
  
      <Form.Group controlId="ShareLocation">
        <Form.Check 
          type="checkbox" 
          label="Share your location" 
          checked={shareLocation} 
          onChange={handleLocationChange} 
        />
      </Form.Group>
  
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default CustomForm;
