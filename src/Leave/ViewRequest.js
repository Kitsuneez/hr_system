import Axios from "axios";
import { useEffect, useState } from "react";
import "./Leave.css"
import Moment from 'react-moment';
import $ from 'jquery';
import { Button} from "react-bootstrap";
import Swal from "sweetalert2";


const ViewRequest = () => {
    const [leaves, setLeaves] = useState([])

    useEffect(()=>{
        Axios.get("http://localhost:3001/api/getListOfRequest").then((response)=>{
            setLeaves(response.data)
        }).catch((err)=>{
          console.log(err)
        })
      }, [])
  
        const swalApprove = (data) => {
            data = data.split(",")
            console.log(data)
            var status = data[2]
            if(status === "approved"){
                var show = "Yes, Approve!"
            }else if(status === "rejected"){
                var show = "Yes, Reject."
            }
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: show
              }).then((result) => {
                if(result.isConfirmed){
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:3001/api/approveRequest",
                        processData: true,
                        data:{
                            id: data[0],
                            type: data[1],
                            status: data[2]
                        },
                        success: function(data) {
                            if(data === "OK"){
                                Swal.fire(
                                    'Approve!',
                                    'Request has been approved.',
                                    'success'
                                  ).then(() => {
                                    window.location.reload()
                                  })
                            }else{
                                Swal.fire(
                                    'Denied!',
                                    'Something went wrong.',
                                    'error'
                                  )
                            }
                        },
                        error: function(data){
                            Swal.fire(
                                'Denied!',
                                'Something went wrong.',
                                'error'
                              )
                        }
                    })
                }
              })
        }
  
      return (
          <>
              <header><strong>Leave</strong></header>
              <table className="table table-striped table-bordered container">
              <thead>
                  <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Type of Request</th>
                  <th scope="col">Date of Leave</th>
                  <th scope="col">Number Of Days</th>
                  <th scope="col">Request Date</th>
                  <th scope="col">Action</th>
                  </tr>
              </thead>
              <tbody>
                  {leaves.map((val)=>{
                      return(
                      <tr>
                          <th scope="row">{val.employee_id}</th>
                          <td>{val.name}</td>
                          <td className="request">{val.type_of_request}</td>
                          <td><Moment format="DD/MM/YYYY" className="Date">{val.from_date}</Moment> to <Moment className="Date" format="DD/MM/YYYY">{val.to_date}</Moment></td>
                          <td>{val.number_of_days}</td>
                          <td><Moment format="DD/MM/YYYY" className="Date">{val.date_of_request}</Moment></td>
                          <td style={{whiteSpace: 'nowrap'}}>
                            <Button variant="success" style={{marginRight:'20px'}} onClick={(e) => swalApprove(e.target.value)} value={[val.employee_id, val.type_of_request, "approved"]}>Approve</Button>
                            <button className="btn btn-danger" onClick={(e) => swalApprove(e.target.value)} value={[val.employee_id, val.type_of_request, "rejected"]}>Reject</button>
                          </td>
                      </tr>)
                  })}
              </tbody>
              </table>
          </>
       );
}
 
export default ViewRequest;