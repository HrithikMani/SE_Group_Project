import React, { useState, useContext } from 'react';
import { Container, Button, Form, Card, Image } from 'react-bootstrap';
import Logo from '../images/Logo.PNG';
import ManagerLogo from '../images/Manager.png';
import EmployeeLogo from '../images/Employee.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';

function LoginPage() {
    const uri = useContext(UriContext);
    const navigate = useNavigate();
    const [isFlipped, setFlipped] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [errors, setErrors] = useState({});
    const [mesg, setMesg] = useState('');
    const [loginData, setLoginData] = useState({
        empId: '',
        password: '',
        role: '',
    });

    const handleUserTypeSelect = (userType) => {
        setSelectedUserType(userType);
        setFlipped(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        setErrors({
          ...errors,
          [name]: '',
        });
    };

    const validateForm = () => {
        const newErrors = {};
    
        // Email validation
        if (!loginData.empId.trim()) {
          newErrors.empId = 'Employee Id is required';
        } else if (loginData.empId.length !== 6) {
          newErrors.empId = 'Invalid employee id address';
        }
        if (!loginData.password.trim()) {
            newErrors.password = 'Password is required';
          } else if (loginData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
          }
          setErrors(newErrors);
          return Object.values(newErrors).every((error) => !error);
    };

    const handleLogin = async () => {
      loginData.role = selectedUserType;
  
      if (!validateForm()) {
          return;
      }
  
          const response = await fetch(uri+'/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(loginData),
          });
  
          if (!response.ok) {
              const responseData = await response.json();
              setMesg(responseData.message);
              return;
          }
  
          const responseData = await response.json();
  
          if (responseData.message === 'Logged successfully') {
              localStorage.setItem('token', responseData.token);
              localStorage.setItem('user', loginData.empId);
              localStorage.setItem('userRole', loginData.role);
              navigate('/home');
              
          } else {
              console.log('Login failed. Server response:', responseData);
              setMesg(responseData.message);
          }
      
  };
  
      

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className={`login-card ${isFlipped ? 'flipped' : ''}`}>
                <Card.Body className={isFlipped ? 'card-back' : 'card-front'}>
                    <Image src={Logo} alt="Logo" className="d-block mx-auto mb-3" style={{ maxWidth: '100px', paddingTop: '5%' }} />
                    {!isFlipped ? (
                        <div className="d-flex flex-column align-items-center">
                            <Button className="logo-btn" variant="primary" onClick={() => handleUserTypeSelect('manager')}>
                                <Image src={ManagerLogo} alt="Manager" className="mr-2" style={{ width: '24px' }} />
                                Manager
                            </Button><br />
                            <Button className="logo-btn" variant="primary" onClick={() => handleUserTypeSelect('employee')}>
                                <Image src={EmployeeLogo} alt="Employee" className="mr-2" style={{ width: '24px' }} />
                                Employee
                            </Button>
                        </div>
                    ) : (
                        <>{mesg && <p style={{ color: 'red', textJustify:'center' }}>{mesg}</p>}
                        <Form>
                        <div className='form-inputs'>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="empId"
                                        value={loginData.empId}
                                        onChange={handleChange}
                                        placeholder="Enter Employee Id"
                                    />
                                </Form.Group>
                                {errors.empId && <p style={{ color: 'red' }}>{errors.empId}</p>}
                            </div>
                            <div className='form-inputs'>
                                <Form.Group>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                            </div>
                            <div className='form-inputs'><a href='/reset-password'>Forget Password?</a></div>
                            <div className="login-btn">
                                <Button variant="primary" onClick={handleLogin} style={{ margin: '20px' }}>
                                    Log In
                                </Button>
                            </div>
                        </Form></>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginPage;
