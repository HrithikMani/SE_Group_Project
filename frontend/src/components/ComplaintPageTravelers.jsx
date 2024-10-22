import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import './ComplaintPageTravelers.css';
import { Link } from 'react-router-dom';
import Logo from '../images/Logo.PNG';
import './NavigationBar.css';
import UriContext from '../UriContext';

function ComplaintPageTravelers() {
  const uri = useContext(UriContext);
  const initialFormData = {
    trainNo: '',
    coachType: '',
    compartment: '',
    location: '',
    serviceType: '',
    issue: '',
  };

  const [trains, setTrains] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedCoachType, setSelectedCoachType] = useState('');

  const [trainDetails, setTrainDetails] = useState({
    traintype: '',
    coach: [{
      type: '',
      compartment: ['']
    }],
    location: [''],
    service: [{
      type: '',
      issue: ['']
    }]
  });
  const [formData, setFormData] = useState({
    trainNo: '',
    coachType: '',
    compartment: '',
    location: '',
    serviceType: '',
    issue: '',
    status: '',
  });
  const [isSubmit, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSubmitAnotherButton, setShowSubmitAnotherButton] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the specific field error when the user types
    setFormErrors({
      ...formErrors,
      [name]: '',
    });

    if (name === 'coachType') {
      setSelectedCoachType(value);
    }

    if (name === 'serviceType') {
      setSelectedServiceType(value);
    }
  };

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch(uri+'/get-trains');
        if (response.ok) {
          const data = await response.json();
          setTrains(data);
        } else {
          alert('Failed to fetch trains');
        }
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
      }
    };

    fetchTrains();
  }, []);

  const validateForm = () => {
    const newFormErrors = {};

    // Check if required fields are empty
    if (!formData.trainNo) {
      newFormErrors.trainNo = 'Enter the Train Number';
    }

    if (!formData.coachType) {
      newFormErrors.coachType = 'Select Coach Type is required';
    }

    if (!formData.compartment) {
      newFormErrors.compartment = 'Select Compartment is required';
    }

    if (!formData.location) {
      newFormErrors.location = 'Select location is required';
    }

    if (!formData.serviceType) {
      newFormErrors.serviceType = 'Select Service Type is required';
    }

    if (!formData.issue) {
      newFormErrors.issue = 'Select Issue is required';
    }

    // Update state with the new error messages
    setFormErrors(newFormErrors);

    // Return true if there are no errors
    return Object.values(newFormErrors).every((error) => !error);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    formData.status = 'open';

    if (!validateForm()) {
      return;
    }

    const response = await fetch(uri+'/submit-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log('Complaint raised successfully.');
      setSubmitted(true);
      setShowSubmitAnotherButton(true);
      setFormData(initialFormData);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setShowSubmitAnotherButton(false);
  };

  const getTrain = async (e) => {  
    const { name, value } = e.target;
    if (value.length === 5) {
      formData.trainNo = value;
      const data = await fetch(uri+'/get-train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'trainNo': formData.trainNo })
      });
      const trainData = await data.json();
      setTrainDetails(trainData);
    }
  }

  return (
    <section>
      <Navbar bg="dark" expand="lg" fixed="top">
        <Navbar.Brand className="brand" style={{ color: 'white' }}>
          <img src={Logo} alt="RailCarCareLogo" className="image-logo" />
          RailCarCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="custom-nav">
            <p style={{ color: 'white', margin: '10px' }}>Are you a manager or an employee?</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container className="complaint-container">
         {!isSubmit ? (
          <Form className="complaint-form">
            <h2 className="mb-4">Raise a Complaint</h2>
            <Form.Group>
              <Form.Control
                as="select"
                name="trainNo"
                value={formData.trainNo}
                onChange={getTrain}
                isInvalid={!!formErrors.trainNo}
              >
                <option>Select Train No</option>
                {(trains).map((train) => (
                  <option key={train} value={train.trainNo}>
                    {train.trainNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.trainNo && <p style={{ color: 'red' }}>{formErrors.trainNo}</p>}
            <Form.Group>
              <Form.Control
                as="select"
                name="coachType"
                value={formData.coachType}
                onChange={handleChange}
                isInvalid={!!formErrors.coachType}
              >
                <option>Select Coach Type</option>
                {(trainDetails.coach).map((coach) => (
                  <option key={coach} value={coach.type}>
                    {coach.type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.coachType && <p style={{ color: 'red' }}>{formErrors.coachType}</p>}
            <Form.Group>
              <Form.Control
                as="select"
                name="compartment"
                value={formData.compartment}
                onChange={handleChange}
                isInvalid={!!formErrors.compartment}
              >
                <option>Select Compartment</option>
              {trainDetails.coach
                .find((coach) => coach.type === selectedCoachType)
                ?.compartment.map((compartment) => (
                  <option key={compartment} value={compartment}>
                    {compartment}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.compartment && <p style={{ color: 'red' }}>{formErrors.compartment}</p>}
            <Form.Group>
              <Form.Control
                as="select"
                name="location"
                value={formData.location}
                onChange={handleChange}
                isInvalid={!!formErrors.location}
              >
                <option>Select Location</option>
                {(trainDetails.location).map((coach) => (
                  <option key={coach} value={coach}>
                    {coach}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.location && <p style={{ color: 'red' }}>{formErrors.location}</p>}
            <Form.Group>
              <Form.Control
                as="select"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                isInvalid={!!formErrors.serviceType}
              >
                <option>Select Service type</option>
                {(trainDetails.service).map((coach) => (
                  <option key={coach} value={coach.type}>
                    {coach.type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.serviceType && <p style={{ color: 'red' }}>{formErrors.serviceType}</p>}
            <Form.Group>
              <Form.Control
                as="select"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                isInvalid={!!formErrors.issue}
              >
                <option>Select Issue</option>
              {trainDetails.service
                .find((service) => service.type === selectedServiceType)
                ?.issue.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {formErrors.issue && <p style={{ color: 'red' }}>{formErrors.issue}</p>}
            <Form.Group>
              <Form.Control
                as="textarea"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder='Complaint Description (Optional)'
              />
            </Form.Group>
            <Button variant="primary" onClick={handleComplaintSubmit}>
              Submit
            </Button>
          </Form>
         ) : (
            <div>
              <h2 style={{ color: "white" }}>Complaint submitted successfully!</h2>
              {showSubmitAnotherButton && (
                <Button variant="success" onClick={handleSubmitAnother}>
                  Submit Another Complaint
                </Button>
              )}
            </div>

         )}
      </Container>
    </section>
  );
}

export default ComplaintPageTravelers;
