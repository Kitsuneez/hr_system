import React from 'react';
import "./App.css";
import Navbar from './Navbar';
import EmployeeList from './EmployeeList/EmployeeList';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
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
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/EmployeeList">
              <EmployeeList />
            </Route>
            <Route path="/Leaves">
              <Leave />
            </Route>
            <Route path="/ViewRequest">
              <ViewRequest />
            </Route>
            <Route path="/CorporateExpiry">
              <CorporateExpiry />
            </Route>
            <Route path="/addEmployee">
              <AddEmployee />
            </Route>
            <Route path="/UpdateEmployee/:id" component={EmployeeList}>
              <UpdateEmployee />
            </Route>
            <Route path="/StaffExpiry">
              <StaffExpiry />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;
