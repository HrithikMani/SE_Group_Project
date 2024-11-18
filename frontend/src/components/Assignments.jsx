import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import UnassignedTasksModal from './UnassignedTasksModal';
import NavBar from './NavBar';
import './Assignments.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';


const AssignedTasks = () => {
  const uri = useContext(UriContext);
  const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }
    const fetchAssignedTasks = async () => {
      try {
        const response = await fetch(uri+'/get-assigned-tasks');
        if (response.ok) {
          const data = await response.json();
          setAssignedTasks(data);
        } else {
          console.error('Failed to fetch assigned tasks');
        }
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
      }
    };

    fetchAssignedTasks();
  });

  const handleDelete = async (task) => {
    const id = task._id;
    const trainNo = task.trainNo;
    const compartment = task.compartment;
    const empId = task.empId;
    const status = 'close';
    try {
      const response = await fetch(uri+`/delete-assignment/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Assignment deleted successfully.');
        const response = await fetch(uri+'/update-user-assign',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'empId': empId, 'status': 'unassign'}),
      });
        if (response.ok) {
          const resp = await fetch(uri+'/update-complaint-assign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'trainNo': trainNo, 'compartment': compartment, 'status': status }),
          });
          if(resp.ok){
          const updatedTasks = assignedTasks.filter((task) => task._id !== id);
          setAssignedTasks(updatedTasks);
          window.location.reload();}
        } else {
          console.error('Failed to delete complaint');
        }
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className='container'>
      <h2 style={{color: 'white'}}>Assigned Tasks</h2>
      <Row>
        {assignedTasks.map((task) => (
          <Col key={task._id} md={4} sm={6} xs={12} className="mb-4">
            <Card className="assign-train bg-white text-dark">
              <Card.Body>
                <Card.Title>{task.assignId}</Card.Title>
                <Card.Text>
                  <strong>Assigned To:</strong> {task.empName}
                  <br />
                  <strong>Train No:</strong> {task.trainNo}<br/>
                  <strong>Coach Type:</strong> {task.coachType}<br />
                  <strong>Compartment:</strong> {task.compartment}<br />
                  <strong>Issue:</strong> {task.issue}<br />
                </Card.Text>
                <Button variant="danger" onClick={() => handleDelete(task)} disabled={task.status === 'closed' ? true : false}>Mark as Completed</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {assignedTasks.length === 0 && (
          <Col xs={12} className="text-center">
            <h2 style={{color: 'white'}}>No assigned tasks yet.</h2>
          </Col>
        )}
      </Row>
    </div>
  );
};

const AssignOrder = () => {
  const uri = useContext(UriContext);
  const navigate = useNavigate();
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = localStorage.getItem('user');
      try {
        const ordersResponse = await fetch(uri+'/get-unassigned-complaints');
        const techniciansResponse = await fetch(uri+'/get-technicians', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'user': user}),
        });

        if (ordersResponse.ok ) {
          const ordersData = await ordersResponse.json();
          const techniciansData = await techniciansResponse.json();

          setUnassignedOrders(ordersData);
          setTechnicians(techniciansData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignOrder = async () => {
    if (!selectedOrder || !selectedTechnician) {
      alert('Please select an order and a technician.');
      return;
    }
    const assignId = generateRandomAssignmentId();
    const selectedOrderData = JSON.parse(selectedOrder);
    const selectedTechnicianData = JSON.parse(selectedTechnician);

    const assignment = {
      assignId: assignId,
      trainNo: selectedOrderData.trainNo,
      coachType: selectedOrderData.coachType,
      compartment: selectedOrderData.compartment,
      issue: selectedOrderData.issue,
      empId: selectedTechnicianData.empId,
      empName: selectedTechnicianData.empFirstName,
      status: 'assign',
    };

    try {

      const response = await fetch(uri+'/assign-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        const emp= assignment.empId;
        const trainNo = assignment.trainNo;
        const compartment =assignment.compartment;
        const status = 'assigned';
        alert('Order assigned successfully.');
        const resp = await fetch(uri+'/update-complaint-assign',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'trainNo': trainNo,'compartment': compartment, 'status': status}),
      });

        const response = await fetch(uri+'/update-user-assign',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'empId': emp, 'status': 'assigned'}),
      });
      if(resp.ok && response.ok){
        setSelectedOrder('');
        setSelectedTechnician('');
        fetchUnassignedOrders();
        window.location.reload();
      } else {
        alert('Failed to assign order.');
      }}
    } catch (error) {
      console.error('Error assigning order:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchUnassignedOrders = async () => {
    try {
      const response = await fetch(uri+'/get-unassigned-complaints');

      if (response.ok) {
        const data = await response.json();
        setUnassignedOrders(data);
      } else {
        console.error('Failed to fetch unassigned orders');
      }
    } catch (error) {
      console.error('Error fetching unassigned orders:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const generateRandomAssignmentId = () => {
    // Generate a random 6-digit assignment ID
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const role = localStorage.getItem('userRole');

  return (
    <main>
      <NavBar onLogout={handleLogout} />
      { role === 'manager' ? (<>
      <div style={{ backgroundColor: "white", margin: "20px", borderRadius:"5px", padding: '20px'}}>
        <h2>Assign Order</h2>
        <select value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
          <option value="">Select Order</option>
          {unassignedOrders.map((order) => (
            <option key={order._id} value={JSON.stringify(order)}>
              {order.trainNo} - {order.compartment} - {order.location} - {order.issue}
            </option>
          ))}
        </select>
        <select value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
          <option value="">Select Technician</option>
          {technicians.map((technician) => (
            <option key={technician._id} value={JSON.stringify(technician)}>
              {technician.empId} - {technician.empFirstName}
            </option>
          ))}
        </select>
        <Button onClick={handleAssignOrder}>Assign Order</Button>
        <Button onClick={openModal}>View Unassigned Tasks</Button>

        <UnassignedTasksModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          unassignedOrders={unassignedOrders} />
      </div>
      <AssignedTasks /> </>): (
        <><AssignedTasks /></>
      )}
      
    </main>
  );
};

export default AssignOrder;
