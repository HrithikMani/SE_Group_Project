import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';

import './App.css';
import ComplaintPageTravelers from './components/ComplaintPageTravelers';

import EmployeePage from './components/EmployeeForm';
import UriContext from './UriContext';


function App() {



  return (
    <div className="App">
      <UriContext.Provider>
      <Router>
        <Routes>
          <Route path='/' element={<ComplaintPageTravelers/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/create-employee" element={<EmployeePage/> }/>
        </Routes>
      </Router>
      </UriContext.Provider>
    </div>
  );
}

export default App;