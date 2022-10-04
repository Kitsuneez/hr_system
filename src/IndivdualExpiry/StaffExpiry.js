import { useEffect, useState } from "react";
import Axios from "axios";
import Moment from 'react-moment';
import $ from 'jquery'
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const StaffExpiry = () => {
    const [employeeList, setEmployeeList] = useState([])

    useEffect(()=>{
      Axios.get("http://localhost:3001/api/getIndivExpiry").then((response)=>{
          setEmployeeList(response.data)
      }).catch((err)=>{
        console.log(err)
      })
    }, [])
    
    return (
      <>
        <header><strong>Employees</strong></header>
        <table className="table table-striped table-bordered container">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Work Permit</th>
                <th scope="col">CSOC</th>
                <th scope="col">CoreTrade</th>
                <th scope="col">Passport</th>
                <th scope="col">Forklift</th>
                <th scope="col">Driving License</th>
              </tr>
            </thead>
            <tbody>
            {employeeList.map((val)=>{
                  return (
                      <tr>
                        <th scope="row">{val.id}</th>
                        <td>{val.name}</td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.end_date}</Moment></td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.CSOC_expiry}</Moment></td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.coreTrade_expiry}</Moment></td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.passport_expiry}</Moment></td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.forklift_expiry}</Moment></td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.driving_license_expiry}</Moment></td>
                      </tr>
                  )
                })}
            </tbody>
        </table>
      </>
    )
}
 
export default StaffExpiry;
