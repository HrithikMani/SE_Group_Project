import React, { useState, useEffect, useContext } from 'react';
import './Orders.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';

function Orders() {
  const uri = useContext(UriContext);
  const user =localStorage.getItem('user');
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ date: '', empId: user, itemName: '', price: '', status: '' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }

    const fetchOrders = async () => {
      if(role === 'manager'){
        try {
            const response = await fetch(uri+'/get-orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data); // Set the profile data including empId
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
      }else{
        try {
          const response = await fetch(uri+'/get-orders-emp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({user}),
          });
          if (response.ok) {
              const data = await response.json();
              setOrders(data); // Set the profile data including empId
          } else {
              console.error('Failed to fetch profile');
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
      }
      }
    };

    fetchOrders();
}, [navigate]);


  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const priceRegex = /^\$\d+(\.\d{0,2})?$/;

  const validatePrice = (price) => priceRegex.test(price);

  const validateFields = () => {
    const { itemName, status } = newOrder;
    return itemName && status && validatePrice(newOrder.price);
  };

  const handleAddOrderClick = () => {
    setNewOrder({ ...newOrder, date: getCurrentDate() });
    setShowAddModal(true);
  };

  const handleStatusChange = async(orderId, newStatus) => {
    const response = await fetch(uri+'/update-order',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'_id': orderId, 'status': newStatus}),
      });
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
    window.location.reload();
    setEditingOrderId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const submitAddOrder = async() => {
    if (!validateFields()) {
      alert('Please fill out all fields with valid information, including Employee Name, Item Name, and Status.');
      return;
    }
    const response = await fetch(uri+'/add-order',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder),
    })
    if(response.ok){
    setShowAddModal(false);
    setNewOrder({ date: '', empId: user, itemName: '', price: '', status: '' });
    window.location.reload();
    }

  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleDelete = async(id) => {
    setOrders(orders.filter(order => order.id !== id));
    try {
        const response = await fetch(uri+`/delete-order/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('Complaint deleted successfully.');
          window.location.reload(); // Refresh the complaints after deletion
        } else {
          console.error('Failed to delete complaint');
        }
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setOrders(orders.filter(order => 
      order.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  // JSX for Add Order Modal
  const renderAddOrderModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Order</h2>
        <form>
          <input
            type="text"
            name="date"
            value={newOrder.date}
            onChange={handleInputChange}
            placeholder="Date (DD/MM/YYYY)"
            readOnly // Making the date field read-only
          />
          <input
            type="text"
            name="employeeId"
            value={user}
            readOnly
          />
          <input
            type="text"
            name="itemName"
            value={newOrder.itemName}
            onChange={handleInputChange}
            placeholder="Item Name"
          />
          <input
            type="text"
            name="price"
            value={newOrder.price}
            onChange={handleInputChange}
            placeholder="Price (e.g., $123.45)"
          />
          <select
            name="status"
            value={newOrder.status}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
          </select>
          <div className="modal-actions">
            <button type="button" onClick={submitAddOrder}>Submit New Order</button>
            <button type="button" onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="orders-container">
      <NavBar onLogout={handleLogout} />
      <header className="orders-header">
        <h1>Orders Management</h1>
        <button onClick={handleAddOrderClick}>Add Order</button>
      </header>
      
      <div className="orders-filters">
        <input type="text" placeholder="Search for..." onChange={handleSearchChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
  
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order No.</th>
            <th>Date</th>
            <th>Employee Id</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index+1}</td>
              <td>{order.date}</td>
              <td>{order.empId}</td>
              <td>{order.itemName}</td>
              <td>{order.price}</td>
              <td>
                {editingOrderId === order._id ? (
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    onBlur={() => setEditingOrderId(null)}
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                ) : (
                  <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                )}
              </td>
              <td>
                {editingOrderId !== order._id && (
                  <button onClick={() => setEditingOrderId(order._id)}>Edit</button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddModal && renderAddOrderModal()}
    </div>
  );
}

export default Orders;
