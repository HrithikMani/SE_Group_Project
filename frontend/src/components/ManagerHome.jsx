import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar';
import AboutUs from './AboutUs';
import './ManagerHome.css';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';


function ManagerHome() {
  const uri = useContext(UriContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterColumn, setFilterColumn] = useState('empId');
  const [filterValue, setFilterValue] = useState('');
  const [trainStatistics, setTrainStatistics] = useState([]);

  const handleNavigate = ()=>{
    navigate('/assignments');
  }

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(uri+'/get-employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ 'user': localStorage.getItem('user') })
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }

  };

  useEffect(() => {
    
    if(!token){
      navigate('/login');
    }
    fetchEmployees();
  });

  const fetchComplaints = async () => {
    try {
      const response = await fetch(uri+'/get-complaints',{
        headers:{
          'Authorization': token,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
        const uniqueTrains = [...new Set(data.map((complaint) => complaint.trainNo))];
        setTrainStatistics(uniqueTrains.map((train) => ({
          trainNo: train,
          totalRepairs: 0,
          assignedRepairs: 0,
          pendingRepairs: 0,
          completedRepairs: 0,
        })));
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);


  const handleSortAndSearch = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });

    // Perform search on sorted data
    const sortedAndSearchedComplaints = [...employees].sort((a, b) => {
      if (direction === 'ascending') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    }).filter((employee) =>
      employee[filterColumn].toLowerCase().includes(filterValue.toLowerCase())
    );

    setComplaints(sortedAndSearchedComplaints);
  };

  const handleFilter = () => {
    const filteredEmployees = employees.filter((employee) =>
      employee[filterColumn].toLowerCase().includes(filterValue.toLowerCase())
    );
    setEmployees(filteredEmployees);
  };

  const handleClearFilter = () => {
    setFilterColumn('empId');
    setFilterValue('');
    fetchEmployees();
  };

  const calculateTrainStatistics = () => {
    // Calculate statistics for each train
    trainStatistics.forEach((trainStat) => {
      const trainComplaints = complaints.filter((complaint) => complaint.trainNo === trainStat.trainNo);
      trainStat.totalRepairs = trainComplaints.length;
      trainStat.assignedRepairs = trainComplaints.filter((complaint) => complaint.status === 'assigned').length;
      trainStat.pendingRepairs = trainComplaints.filter((complaint) => complaint.status === 'open').length;
      trainStat.completedRepairs = trainComplaints.filter((complaint) => complaint.status === 'close').length;
    });

    setTrainStatistics([...trainStatistics]); // Update state to trigger a re-render
  };

  useEffect(() => {
    calculateTrainStatistics();
  }, [complaints]);

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const userRole = localStorage.getItem('userRole');

  return (<section>
    <NavBar onLogout={handleLogout} />
    {userRole === 'manager' ? (
      <div>
        
      <Row className='row'>
        <Col md={6}>
          <Card>
            <CardBody>
              <h2>Employee Status</h2>
              <div className="filter">
                <label>
                  <select
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                  >
                    <option value="empId">Employee Id</option>
                    <option value="empFirstName">Employee Name</option>
                    <option value="department">Employee Department</option>
                    <option value="status">Employee Status</option>
                    <option value="assignstatus">Assignment Status</option>
                  </select>
                </label>
                <input
                  style={{height: '42px', width: '20%'}}
                  type="text"
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <button onClick={handleFilter}>Filter</button>
                <button onClick={handleClearFilter}>Clear Filter</button>
              </div>
              <div className='table-container'>
                {sortedEmployees.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => handleSortAndSearch('empId')}>Employee Id</th>
                        <th onClick={() => handleSortAndSearch('empFirstName')}>Employee Name</th>
                        <th onClick={() => handleSortAndSearch('department')}>Department</th>
                        <th onClick={() => handleSortAndSearch('status')}>Employee Status</th>
                        <th onClick={() => handleSortAndSearch('assignstatus')}>Assignment Status</th>
                        <th>Assign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedEmployees.map((employee, index) => (
                        <tr key={employee._id}>
                          <td>{employee.empId}</td>
                          <td>{employee.empFirstName}</td>
                          <td>{employee.department}</td>
                          <td>{employee.status}</td>
                          <td>{employee.assignstatus}</td>
                          <td>
                          <Button variant="primary" onClick={handleNavigate} disabled={employee.assignstatus === 'assigned' ? true : false}>
                              Assign
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items found.</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <div className='table-container'>
              <h2>Train Statistics</h2>
              <table>
                <thead>
                  <tr>
                    <th>Train No</th>
                    <th>Total Repairs</th>
                    <th>Assigned Repairs</th>
                    <th>Pending Repairs</th>
                    <th>Completed Repairs</th>
                  </tr>
                </thead>
                <tbody>
                  {trainStatistics.map((trainStat) => (
                    <tr key={trainStat.trainNo}>
                      <td>{trainStat.trainNo}</td>
                      <td>{trainStat.totalRepairs}</td>
                      <td>{trainStat.assignedRepairs}</td>
                      <td>{trainStat.pendingRepairs}</td>
                      <td>{trainStat.completedRepairs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <AboutUs />
      </div>
      ) : (
        <div>
        <section className='carousel'>
      </section>
        <Row>
        <Col md={6}>
        <Card>
          <CardBody>
            <h2>Train Statistics</h2>
            <table>
              <thead>
                <tr>
                  <th>Train No</th>
                  <th>Total Repairs</th>
                  <th>Assigned Repairs</th>
                  <th>Pending Repairs</th>
                  <th>Completed Repairs</th>
                </tr>
              </thead>
              <tbody>
                {trainStatistics.map((trainStat) => (
                  <tr key={trainStat.trainNo}>
                    <td>{trainStat.trainNo}</td>
                    <td>{trainStat.totalRepairs}</td>
                    <td>{trainStat.assignedRepairs}</td>
                    <td>{trainStat.pendingRepairs}</td>
                    <td>{trainStat.completedRepairs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col><Col md={6}>
        <Card>
          <CardBody>
            <h2>Assignment Statistics</h2>
            <table>
              <thead>
                <tr>
                  <th>Total Assignments</th>
                  <th>Pending Repairs</th>
                  <th>Completed Repairs</th>
                </tr>
              </thead>
              <tbody>
                {trainStatistics.map((trainStat) => (
                  <tr key={trainStat.trainNo}>
                    <td>{trainStat.trainNo}</td>
                    <td>{trainStat.totalRepairs}</td>
                    <td>{trainStat.assignedRepairs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
      </Row>
      <AboutUs />
      </div>
  )}
  </section> );
}

export default ManagerHome;