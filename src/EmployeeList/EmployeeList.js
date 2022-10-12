import { useEffect, useState } from "react";
import './Employees.css';
import Moment from 'react-moment';
import $ from 'jquery'
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployeeList = () => {
    const [employeeList, setEmployeeList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [variant, setVariant] = useState("secondary") 

    useEffect(()=>{
      // Axios.get("http://localhost:3001/api/getEmployeeList").then((response)=>{
      //     setEmployeeList(response.data)
      //     setFilteredList(response.data)
      // }).catch((err)=>{
      //   console.log(err)
      // })
      $.ajax({
        method: 'get',
        url: "http://localhost:3001/api/getEmployeeList",
        success: function(data){
          setEmployeeList(data)
          setFilteredList(data)
        }
      })
    }, [])
    const setStatus = (e) => {
      var temp = e.split(",")
      if(temp[0] == "active"){
        var status = "inactive"
      }else if(temp[0] == "inactive"){
        var status = "active"
      }
      console.log(status)
      $.ajax({
        method: "POST",
        url: "http://localhost:3001/api/updateStatus",
        data:{
          status: status,
          id: temp[1],
        },
        success: function(data){
          window.location.replace("http://localhost:3000/employeeList")
        }
      })
    }

    var id = 0;

    const setFilter = (e) => {
      if(e === "all"){
        setFilteredList(employeeList)
        setVariant("secondary")
      }else{
        const newList = employeeList.filter(x=>x.status === e)
        setFilteredList(newList)
        if(e === "active"){
          setVariant("success")
        }else if( e === "inactive"){
          setVariant("danger")
        }
      }
    }
    
    return (
      <>
        <header style={{textAlign: 'center'}}><strong>Employees</strong></header>
        <div  style={{textAlign: 'center'}}>
        <Button variant="primary" style={{float: 'center', marginBottom: "20px", marginRight: 'auto'}} href="AddEmployee">Add Employee</Button>
          <Button variant={variant} className="downdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{marginLeft: '20px', marginBottom: "20px", marginRight: 'auto'}}>
            Status
          </Button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={(e)=>setFilter(e.target.value)} value="all">All</button></li>
            <li><button className="dropdown-item" onClick={(e)=>setFilter(e.target.value)} value="active">Active</button></li>
            <li><button className="dropdown-item" onClick={(e)=>setFilter(e.target.value)} value="inactive">Inactive</button></li>
          </ul>
        </div>
        <table className="table table-striped table-bordered container">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Status</th>
                <th scope="col">Name</th>
                <th scope="col">IC / Fin No</th>
                <th scope="col">Citizenship</th>
                <th scope="col">Birthday</th>
                <th scope="col">Department</th>
                <th scope="col">Position</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((val)=>{
                var citizenship = "Singaporean";
                var expiry_date = "N.A"
                var work_permit_no = "N.A"
                var li = document.createElement("li");
                var found = false
                if(val.employee_id === id){
                    if(document.getElementById(val.employee_id + "department") != null){
                      li.appendChild(document.createTextNode(val.department));
                      $("#"+val.employee_id + "department li").each((id, elem) =>{
                        if(elem.innerText === val.department || elem.innerText === ""){
                          found = true
                        }
                      })
                      if(found === false){
                        document.getElementById(val.employee_id + "department").append(li)
                      }
                    }
                  found= false;
                  li = document.createElement("li");
                  if(document.getElementById(val.employee_id + "position") != null){
                    li.appendChild(document.createTextNode(val.position));
                    $("#"+val.employee_id + "position li").each((id, elem) =>{
                      if(elem.innerText === val.position || elem.innerText === ""){
                        found = true
                      }
                    })
                    if(found === false){
                      document.getElementById(val.employee_id + "position").append(li)
                    }
                  }
                  return null;
                }else{
                  if(val.work_permit_no != null){
                    citizenship = "Foreign Worker";
                    work_permit_no = val.work_permit_no;
                    expiry_date = <Moment format="DD/MMM/YYYY" className="date">{val.expiry_date}</Moment>
                  }
                  id = val.id
                  return (
                      <tr>
                        <th scope="row">{val.id}</th>
                        <td>
                          {val.status}
                        </td>
                        <td>{val.name}</td>
                        <td>{val.IC_number}</td>
                        <td>{citizenship}</td>
                        <td><Moment format="DD/MMM/YYYY" className="date">{val.birthday}</Moment></td>
                        <td>
                          <ul id={val.employee_id + "department"} style={{textAlign:'left'}}>
                            <li>{val.department}</li>
                          </ul>
                        </td>
                        <td>
                          <ul id={val.id + "position"} style={{textAlign:'left'}}>
                            <li>{val.position}</li>
                          </ul>
                        </td>
                        <td>
                          <Link to={"/UpdateEmployee/"+val.id}>
                            <Button variant="secondary" style={{minWidth:"125px", paddingLeft: '0px', paddingRight: '0px', marginBottom:'2px'}}>
                                Update
                              </Button>
                          </Link>
                          <Button variant="secondary" style={{minWidth:"125px", paddingLeft: '0px', paddingRight: '0px'}} value={[val.status, val.id]} onClick={(e)=>setStatus(e.target.value)}>Set Status</Button>
                        </td>
                      </tr>
                  )
                }
              })
              }
            </tbody>
        </table>
      </>
    )
}
 
export default EmployeeList;
