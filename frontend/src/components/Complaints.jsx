import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody } from 'react-bootstrap';
import NavBar from './NavBar';
import AboutUs from './AboutUs';
import './ManagerHome.css';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';

function Complaints() {
  const uri = useContext(UriContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterColumn, setFilterColumn] = useState('trainNo');
  const [filterValue, setFilterValue] = useState('');

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch(uri+'/get-complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(uri+`/delete-complaint/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchComplaints(); // Refresh the complaints after deletion
      } else {
        console.error('Failed to delete complaint');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  const handleSortAndSearch = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });

    // Perform search on sorted data
    const sortedAndSearchedComplaints = [...complaints].sort((a, b) => {
      if (direction === 'ascending') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    }).filter((complaint) =>
      complaint[filterColumn].toLowerCase().includes(filterValue.toLowerCase())
    );

    setComplaints(sortedAndSearchedComplaints);
  };

  const handleFilter = () => {
    const filteredComplaints = complaints.filter((complaint) =>
      complaint[filterColumn].toLowerCase().includes(filterValue.toLowerCase())
    );
    setComplaints(filteredComplaints);
  };

  const handleClearFilter = () => {
    setFilterColumn('trainNo');
    setFilterValue('');
    fetchComplaints();
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  return (
    <div>
      <NavBar onLogout={handleLogout} />
          <Card>
            <CardBody>
            <div className="filter">
          <label>
            <select style={{height: '40px',textJustify: 'center'}}
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
            >
              <option value="trainNo">Train No</option>
              <option value="coachType">Coach Type</option>
              <option value="compartment">Compartment</option>
              <option value="location">Issue Location</option>
              <option value="serviceType">Service Type</option>
              <option value="issue">Issue</option>
              <option value="description">Description</option>
              <option value="status">Status</option>
            </select>
          </label>
          <input style={{height: '40px'}}
            type="text"
            placeholder="Filter value..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <button onClick={handleFilter}>Filter</button>
          <button onClick={handleClearFilter}>Clear Filter</button>
        </div>
        <div className='table-container'>
        {sortedComplaints.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSortAndSearch('trainNo')}>Train No</th>
                <th onClick={() => handleSortAndSearch('coachType')}>CoachType</th>
                <th onClick={() => handleSortAndSearch('compartment')}>Compartment</th>
                <th onClick={() => handleSortAndSearch('location')}>Issue Location</th>
                <th onClick={() => handleSortAndSearch('serviceType')}>Service Type</th>
                <th onClick={() => handleSortAndSearch('issue')}>Issue</th>
                <th onClick={() => handleSortAndSearch('description')}>Description</th>
                <th onClick={() => handleSortAndSearch('status')}>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedComplaints.map((complaint, index) => (
                <tr key={complaint._id}>
                  <td>{complaint.trainNo}</td>
                  <td>{complaint.coachType}</td>
                  <td>{complaint.compartment}</td>
                  <td>{complaint.location}</td>
                  <td>{complaint.serviceType}</td>
                  <td>{complaint.issue}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.status}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(complaint._id)}>
                      Delete
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
      <AboutUs />
    </div>
  );
}

export default Complaints;
