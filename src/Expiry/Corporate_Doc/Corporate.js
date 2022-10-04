import Axios from 'axios';
import Moment from 'react-moment';
import {useEffect, useState} from 'react'
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import Swal from 'sweetalert2';

const Corporate_expiry = () => {
    const [Expiry, setExpiry] = useState([]);
    const [showModal, setShow] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [expiry_date, setExpiryDate] = useState("");
    const [reminder, setReminder] = useState(null);
    const [type, setType] = useState([]);
    const [showAddModal, setShowAdd] = useState(false);
    const [name, setName] = useState("");
    const [docType, setDocType] = useState("");

    useEffect(()=>{
        Axios.get("http://localhost:3001/api/corporateExpiry").then((response)=>{
            setExpiry(response.data)
        }).catch((err)=>{
          console.log(err)
        })
    }, [])
    useEffect(()=>{
        setType(Expiry.map((val)=> val.type))
    }, [Expiry])

    const toggleModal = () =>{
        setShow(!showModal)
    }

    const submitNewDocument = () =>{
        $.ajax({
            type: "POST",
            url: "http://localhost:3001/api/addCorporateExpiry",
            processData: true,
            data:{
                document: name,
                type: docType,
                expiry_date: expiry_date,
                reminder: reminder,
            },success: function(data) {
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
            }

        })
    }
    
    const submitRequest = () => {
        $.ajax({
            type: "POST",
            url: "http://localhost:3001/api/updateCorporateExpiry",
            processData: true,
            data:{
                document: modalData.documents,
                type: modalData.type,
                expiry_date: expiry_date,
                reminder: reminder,
            },success: function(data) {
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
            }

        })
    }

    let prevtype = "";
      return (
          <>
            <Modal show={showModal} onHide={toggleModal} className="modal" tabIndex="-1">
                <Modal.Header closeButton>
                <Modal.Title>Update Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Name: {modalData.documents}<br/>Type: {modalData.type}</h5>                                    
                    <form onSubmit={(e)=>{submitRequest(); e.preventDefault()}}>
                        <label htmlFor="expiry_date" style={{marginRight: '5px'}}>Expiry Date </label>
                        <input type ='date' name="expiry_date" id="datefield" required onChange={(e)=>setExpiryDate(e.target.value)}/>
                        <br/>
                        <label htmlFor="reminder" style={{marginRight: '5px'}}>Set Reminder(Months)</label>
                        <input type="reminder" name="reminder" min="0" value={modalData.reminder} onChange={(e)=>setReminder(e.target.value)} />
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={toggleModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={()=>setShowAdd(false)} className="modal-add" tabIndex="-1">
                <Modal.Header closeButton>
                <Modal.Title>Add Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e)=>{submitNewDocument(); e.preventDefault()}}>
                        <label htmlFor="name" style={{marginRight: '120px', marginBottom:'10px'}}>Name:</label>
                        <input type="text" name="name" min="0" onChange={(e)=>setName(e.target.value)} style={{textTransform: 'capitalize'}}/><br/>
                        <label htmlFor="type" style={{marginRight: '129px', marginBottom:'10px'}}>Type:</label>
                        <input type="text" name="type" min="0" onChange={(e)=>setDocType(e.target.value)}  style={{textTransform: 'capitalize'}}/><br/>
                        <label htmlFor="expiry_date" style={{marginRight: '85px', marginBottom:'10px'}}>Expiry Date </label>
                        <input type ='date' name="expiry_date" id="datefield" required onChange={(e)=>setExpiryDate(e.target.value)}/>
                        <br/>
                        <label htmlFor="reminder" style={{marginRight: '5px', marginBottom:'10px'}}>Set Reminder(Months)</label>
                        <input type="reminder" name="reminder" min="0" onChange={(e)=>setReminder(e.target.value)} />
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={toggleModal}>Close</Button>
                </Modal.Footer>
            </Modal>
              <header><strong>Corporate Documents Expiry</strong></header>
              <Button variant="primary" style={{marginLeft: '80%', marginBottom: "20px", marginRight: 'auto'}} onClick={()=>setShowAdd(true)}>Add document</Button>
              {type.map((types)=>{
                if(prevtype !== types){
                    prevtype = types
                    return (
                        <div>
                            <header style={{textAlign: 'left', marginLeft:'80px'}}>{types}</header>
                            <table className="table table-striped table-bordered container">
                            <thead>
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiry Date</th>
                                <th scope="col">Reminder (Months)</th>
                                <th scope="col">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Expiry.map((val)=>{
                                if(val.type === types){
                                    return(
                                    <tr>
                                        <td style={{textAlign: 'left'}}><strong style={{backgroundColor: 'transparent'}}>{val.documents}</strong></td>
                                        <td><Moment format="DD/MM/YYYY" className="Date">{val.expiry_date}</Moment></td>
                                        <td>{val.reminder}</td>
                                        <td>
                                          <Button variant="secondary" onClick={()=>{setModalData(val); toggleModal()}}>
                                              Update
                                          </Button>
                                        </td>
                                    </tr>
                                    )
                                }else{
                                    return null;
                                }
                            })}
                            </tbody>
                            </table>
    
                        </div>
                        )
                }else{
                    return null;
                }
              })}
          </>
       );
}
 
export default Corporate_expiry;