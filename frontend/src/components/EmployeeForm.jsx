// EmployeeForm.js
import React, { useState, useEffect, useContext } from 'react';
import './EmployeeForm.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';

const EmployeeForm = () => {
  const uri = useContext(UriContext);
  const user = localStorage.getItem('user');
  console.log(user);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    empId: '',
    department: '',
    role: 'employee',
    manager: user,
    email: '',
    empFirstName: '',
    empLastName: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!employee.empId.trim()) {
      newErrors.empId = 'Emp Id is required';
    } 

    if (!employee.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!employee.empFirstName.trim()) {
      newErrors.empFirstName = 'First Name is required';
    }

    if (!employee.empLastName.trim()) {
      newErrors.empLastName = 'Last Name is required';
    }

    if (!employee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(employee.email)) {
      newErrors.email = 'Invalid email format';
    } 

    if (!employee.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    const user = localStorage.getItem('user');
    e.preventDefault();

    if (!validateForm()) {
      setFormSubmitted(true);
      return;
    }

    try {
      const response = await fetch(uri+'/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        alert('Employee created successfully!');
        setEmployee({
          empId: '',
          department: '',
          role: 'employee',
          manager: user,
          email: '',
          empFirstName: '',
          empLastName: '',
          password: '',
        });
        setFormSubmitted(false);
      }
    } catch (error) {
      console.error('Error creating employee:', error.message);
    }
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="employee-container">
        <div className="employee-content">
          <div className="employee-fields">
            <div className="form-field">
              <label htmlFor="empId">Emp Id</label>
              <input name="empId" id="empId" value={employee.empId} onChange={handleChange} />
              {formSubmitted && errors.empId && <span className="error-message">{errors.empId}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="department">Department</label>
              <input name="department" id="department" value={employee.department} onChange={handleChange} />
              {formSubmitted && errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="forename">First Name</label>
              <input name="empFirstName" id="forename" value={employee.empFirstName} onChange={handleChange} />
              {formSubmitted && errors.empFirstName && <span className="error-message">{errors.empFirstName}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="surname">Last Name</label>
              <input name="empLastName" id="surname" value={employee.empLastName} onChange={handleChange} />
              {formSubmitted && errors.empLastName && <span className="error-message">{errors.empLastName}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" value={employee.email} onChange={handleChange} />
              {formSubmitted && errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input name="password" id="password" value={employee.password} onChange={handleChange} />
              {formSubmitted && errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button onClick={handleSubmit} className="save-button">
              Create Employee
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeForm;
