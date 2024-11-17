// UnassignedTasksModal.jsx
import React from 'react';
import Modal from 'react-modal';
const UnassignedTasksModal = ({ isOpen, closeModal, unassignedOrders }) => {
  return (
    <Modal contentLabel="Unassigned Tasks" >
      <h2>Unassigned Tasks</h2>
    </Modal>
  );
};

export default UnassignedTasksModal;
