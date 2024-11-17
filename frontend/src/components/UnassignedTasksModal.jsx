// UnassignedTasksModal.jsx
import React from 'react';
import Modal from 'react-modal';
const UnassignedTasksModal = ({ isOpen, closeModal, unassignedOrders }) => {
  return (
    <Modal style={{alinItems: 'center'}} isOpen={isOpen} contentLabel="Unassigned Tasks" >
      <h2>Unassigned Tasks</h2>
      <ul>
      {unassignedOrders === 0 ?(<li>No tasks found</li>) : (unassignedOrders.map((order)=> (
          <li key={order._id}>
            {order.trainNo} - {order.compartment} - {order.location} - {order.issue}
          </li>
        )))}
      </ul>
    </Modal>
  );
};

export default UnassignedTasksModal;
