import React, { Fragment } from 'react';
import "./App.css";
import Navbar from './Navbar';
import EmployeeList from './EmployeeList/EmployeeList';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Leave from './Leave/Leave';
import ViewRequest from './Leave/ViewRequest';
import CorporateExpiry from './Expiry/Corporate_Doc/Corporate'
import AddEmployee from './EmployeeList/AddEmployee';
import UpdateEmployee from './EmployeeList/UpdateEmployee';
import StaffExpiry from './IndivdualExpiry/StaffExpiry';

function App(){

  return (
    <Router>
      <Fragment>
          <Navbar />
            <Routes>
              <Route exact path="/" element={<Dashboard/>} />
              <Route path="/EmployeeList" element={<EmployeeList />} />
              <Route path="/Leaves" element={<Leave />} />
              <Route path="/ViewRequest" element= {<ViewRequest/>}/>
              <Route path="/CorporateExpiry" element={<CorporateExpiry />} />
              <Route path="/addEmployee" element={<AddEmployee/>}/>
              <Route path="/UpdateEmployee/:id" component={EmployeeList} element={<UpdateEmployee/>}/>
              <Route path="/StaffExpiry" element={<StaffExpiry />}/>
            </Routes>
      </Fragment>
    </Router>
  )
}

export default App;
