import Axios from "axios";
import { useEffect, useState } from "react";
import "./Leave.css"
import {Modal, Button} from "react-bootstrap";
import $ from 'jquery';


const Leave = () => {
    const [leaves, setLeaves] = useState([])

    const [showModal, setShow] = useState(false)
    const [modalData, setModalData] = useState({
        employee_id: null,
        name: null,
        paid_leave: null,
        medical_leave: null,
        compassionate_leave: null
    })

    const toggleModal = () => {
        setShow(!showModal)
    }

    const [employee_id, setId] = useState("")
    const [leavetype, setleaverequest] = useState("")
    const [days, setdays] = useState("")
    const [fromdate, setfromdate] = useState("")
    const [max, setMax] = useState("")
    const [toDate, setToDate] = useState("")
    const [getDate, setDate] = useState("");

    const settingMax = (id, data) => {
        setleaverequest(data)
        setId(id)
        if(data === "compassionate_leave"){
            setMax(modalData.compassionate_leave)
        }else if(data === "medical_leave"){
            setMax(modalData.medical_leave)
        }else if(data === "paid_leave"){
            setMax(modalData.paid_leave)
        }
    }


    useEffect(()=>{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
        var yyyy = today.getFullYear();
        if(dd<10){
        dd='0'+dd
        } 
        if(mm<10){
        mm='0'+mm
        } 

        today = yyyy+'-'+mm+'-'+dd;
        setDate(today);

    },[])

    useEffect(()=>{
        $.ajax({
            type:'get',
            url:"http://localhost:3001/api/getLeave",
            success: function(data){
                setLeaves(data)
            }
        })
    }, [])

    const submitRequest = (e) => {
        console.log(":?")
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "http://localhost:3001/api/submitRequest",
            processData: true,
            data:{
                employee_id: employee_id,
                leavetype: leavetype,
                days: days,
                from_date: fromdate,
                to_date: toDate,
            },
            success: function(data) {
                if(data === "OK"){
                    alert("Request submitted successfully")
                }else{
                    alert("Error submitting")
                }
            },
            error: function(data){
                alert("Error submitting")
            }
        })
    }

    return (
        <>
            <header style={{textAlign: 'center'}}><strong>Leave</strong></header>
            <div  style={{textAlign: 'center'}}>
                <a className="btn btn-danger" href="/viewRequest">View All Requests</a>
            </div>
            <table className="table table-striped table-bordered container">
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Paid Leave</th>
                <th scope="col">Medical Leave</th>
                <th scope="col">Compassionate Leave</th>
                <th scope="col">Leave Application</th>
                </tr>
            </thead>
            <tbody>
                {leaves.map((val)=>{
                    return(
                    <tr>
                        <th scope="row">{val.employee_id}</th>
                        <td>{val.name}</td>
                        <td>{val.paid_leave}</td>
                        <td>{val.medical_leave}</td>
                        <td>{val.compassionate_leave}</td>
                        <td>
                            <Button variant="primary" className="btn btn-primary col-md-auto" onClick={()=>{setModalData(val); toggleModal()}}>Leave Request</Button>
                            <Modal show={showModal} onHide={toggleModal} className="modal" tabIndex="-1">
                                <Modal.Header closeButton>
                                <Modal.Title>Leave Application</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h5>ID: {modalData.employee_id}<br/>Name: {modalData.name}</h5>
                                    <form onSubmit={(e)=>submitRequest(e)}>
                                        <input 
                                            type="hidden" 
                                            value={modalData.employee_id} 
                                            name="employee_id"
                                            required
                                            />

                                        <label htmlFor="leave" style={{marginRight: '5px'}}><p>Choose Type Of Leave: </p></label>

                                        <select 
                                        name="leave" 
                                        id={modalData.employee_id + "type"} 
                                        onChange={(e) => {settingMax(modalData.employee_id, e.target.value);}}
                                        required
                                        defaultValue={"Default"}>
                                        <option disabled value="Default">Choose One</option>
                                        <option value="paid_leave">Paid Leave</option>
                                        <option value="medical_leave">Medical Leave</option>
                                        <option value="compassionate_leave">Compassionate Leave</option>
                                        </select>
                                        <label htmlFor="days" style={{marginRight: '5px'}}>Enter Number of Days: </label>
                                        <input 
                                        type="number" 
                                        name="days" 
                                        min="1" 
                                        max={max} 
                                        id={modalData.employee_id + "days"}
                                        onChange = {(e) => {setdays(e.target.value);}}
                                        /><br/><br/>
                                        <label htmlFor="from_date" style={{marginRight: '5px'}}>From </label>
                                        <input type ='date' name="from_date" min={getDate} id="datefield"  onChange={(e) => setfromdate(e.target.value)} required/>
                                        <label htmlFor="from_date" style={{marginLeft: '5px', marginRight: '5px'}}>to </label>
                                        <input type ='date' name="to_date" min={getDate} onChange={(e) => setToDate(e.target.value)} required/><br/><br/>
                                        <button type="submit" className="blue-btn" id='submit'>Submit Request</button>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={toggleModal}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </td>
                    </tr>)
                })}
            </tbody>
            </table>
        </>
     );
}
 
export default Leave;