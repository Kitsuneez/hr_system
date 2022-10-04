import "./Employees.css"
import $ from 'jquery';
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from "react";
const AddEmployee = () => {
    const [showPermit, setState] = useState(false)
    const [formData, setData] = useState([]) 
    const [position, setPosition] = useState([])
    const [department, setDepartment] = useState([])
    const [selectPosition, setSelect] = useState([])
    const nameref = useRef()
    const permitref = useRef("")
    const ICref = useRef()
    const citizenref = useRef()
    const birthref = useRef()
    const salaryref = useRef()
    const emailref = useRef()
    const phoneref = useRef()
    const paynowref = useRef()
    const bankref = useRef()
    const startref = useRef()
    const expireref = useRef()
    const passportRef = useRef()
    const passportExpiryRef = useRef()
    let previous_value = ""
    

    const showMore = (data) => {
        if(data === "foreign-worker"){
            setState(true)
        }else{
            setState(false)
        }
    }
    useEffect(() => {
        
    }, [selectPosition]);

    useEffect(()=>{
        $.ajax({
            method: "GET",
            url: "http://localhost:3001/api/getDepartment",
            success: function(data) {
                setDepartment(data)
            }
        })
    }, [])

    const addPosition = (e) =>{
        e.preventDefault()
        if(e.target.value !== undefined){
            if(position.includes(e.target.value)){
                const temp = position
                const index = temp.indexOf(e.target.value)
                temp.splice(index, 1)
                setPosition(temp)
            }else{
                const temp = e.target.value
                const newlist = position.concat(temp)
                setPosition(newlist)
            }
        }
    }

    
    const WorkPermit = () => {
        return(
            <div>
                <div className="form-group col py-3">
                        <label htmlFor="permit">Work Permit</label>
                        <input ref={permitref} key="permit" type="text" name="permit" id="permit" className="form-control" required />
                </div>
                <div className="form-group col py-3">
                    <label htmlFor="permit">Date Of Issue</label>
                    <input ref={startref} key="date" type="date" name="permit" id="permit" className="form-control" required />
                </div>
                <div className="form-group col py-3">
                    <label htmlFor="permit">Expiration Date</label>
                    <input ref={expireref} key="expire" type="date" name="permit" id="permit" className="form-control" required />
                </div>
            </div>
        )
    }

    const ShowBlank = () => {
        return(
            <>
                <input type="hidden" ref={permitref} value="" style={{display: 'none'}}/>
                <input type="hidden" ref={startref} value="" style={{display: 'none'}}/>
                <input type="hidden" ref={expireref} value="" style={{display: 'none'}}/>
            </>
        )
    }
    const handleSubmit = (e) => {
        setData({
            name: nameref.current.value, 
            permit: permitref.current.value, 
            ic: ICref.current.value, 
            citizen:citizenref.current.value, 
            birthday:birthref.current.value, 
            salary:salaryref.current.value, 
            email: emailref.current.value, 
            phone: phoneref.current.value, 
            paynow: paynowref.current.value, 
            bank: bankref.current.value,
            start: startref.current.value,
            expire: expireref.current.value,
            position: position,
            passportNo: passportRef.current.value,
            passportExpiry: passportExpiryRef.current.value
        })
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/api/addEmployee',
            processData: true,
            data: JSON.stringify(formData, getCircularReplacer()),
            contentType: 'application/json',
            success: function(data) {
                console.log("got it")
                if(data === "OK"){
                    Swal.fire(
                        'Approve!',
                        'Request has been approved.',
                        'success'
                        )
                        .then(() => {
                          window.location.replace('/EmployeeList')
                        })
                    }else{
                        Swal.fire(
                            'Denied!',
                            data,
                            'error'
                            )
                        }
                    }
        })
    }

    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };

    const filter = (value) => {
        const newList = department.filter(x=>x.department === value)
        setSelect(newList)
        ShowPosition()
    }

    const ShowPosition = () => {
        if(selectPosition.length === 0){
            return(
                <>
                    <div className="form-group col py-3" id="position" key="position">
                        <p>Position:</p>
                        <p style={{marginLeft: "40px"}}><strong>Select a department</strong></p>
                    </div>
                </>
            )
        }      
        return (
            <>
            <div className="form-group col py-3" id="position" key="position">
                <p>Position:</p>
                {selectPosition.map((val, e)=>{
                    if (position.includes(val.position)){
                        var tick = true
                    }
                    return(
                        <>
                        <input defaultChecked={tick} style={{marginLeft: "40px"}} type="checkbox" name="position" value={val.position} onClick={(e)=>{addPosition(e)}}/>
                            {val.position}
                        <br/>      
                        <br/>      
                        </>
                        )
                    })}
            </div>
            </>
        )
    }


    return ( 
    <>
        <div className="admin-padding">
            <div className="col py-3" style={{width: "60%", margin:"0 auto", background:"white",boxShadow: "12px 12px 22px grey", borderRadius:"30px", padding: "40px", marginTop:"20px"}}>
            <h1 className="display-4">Add Employee</h1><span id="datetime"></span>

            <form onSubmit={(e)=>{handleSubmit(e); e.preventDefault()}}>
            
            <div className="form-group col py-3">
                <label htmlFor="name">Name</label>
                <input ref={nameref} type="text" name="name" id="name" className="form-control" />
            </div>
            <div className="form-group col py-3">
                <label htmlFor="IC">IC/Fin Number</label>
                <input ref={ICref} type="text" name="IC" id="IC" className="form-control" required />
            </div>
            <div className="form-group col py-3" id="position">

                <label htmlFor="citizenship" className="labels" key="citizen">Citizenship: </label>
                <select name="citizenship" id="citizenship" onChange={(e)=>showMore(e.target.value)} ref={citizenref} defaultValue={'DEFAULT'} style={{marginRight: '10px'}}>
                <option disabled key="def-cit" value="DEFAULT">Select Citizenship</option>
                <option value="singaporean" key="sg">Singaporean</option>
                <option value="PR" key="pr">PR</option>
                <option value="foreign-worker" key="fw">Foreign Worker</option>
                </select>

                <label htmlFor="department" className="labels" key="department">Department: </label>
                <select name="department" id="department" onChange={(e)=>filter(e.target.value)} ref={citizenref} defaultValue={'DEFAULT'}>
                <option disabled key="default-dep" value="DEFAULT">Select Department</option>
                    {department.map((department, e)=>{
                        if(department.department === previous_value){
                            return null;
                        }else{
                            previous_value = department.department
                            return (
                                <>
                                <option key={e} value={department.department}>{department.department}</option>
                                </>
                            )

                        }
                    })}
                </select>
            </div>
            <ShowPosition/>
            <div className="form-group col py-3">
                <label htmlFor=" passport">Passport Number</label>
                <input ref={passportRef} type="text" name="passport" id="passport" className="form-control" required />
            </div>
            <div className="form-group col py-3">
                <label htmlFor=" passportExpiry">Passport Expiry</label>
                <input ref={passportExpiryRef} type="date" name="birthday" id="birthday" className="form-control" required />
            </div>
            <div className="form-group col py-3">
                <label htmlFor=" birthday">Birthday</label>
                <input ref={birthref} type="date" name="passportExpiry" id="passportExpiry" className="form-control" required />
            </div>
            <div className="form-group col py-3">
                <label htmlFor="salary">Salary</label>
                <input ref={salaryref} type="number" name="salary" id="salary" className="form-control" required step="0.01"/>
            </div>
            <div className="form-group col py-3">
                <label htmlFor="email">Email</label>
                <input ref={emailref} type="email" name="email" id="email" className="form-control" required/>
            </div>
            <div className="form-group col py-3">
                <label htmlFor="phone">Phone Number</label>
                <input ref={phoneref} type="number" name="phone" id="phone" className="form-control" required/>
            </div>
            <div className="form-group col py-3">
                <label htmlFor="paynow">PayNow Number</label>
                <input ref={paynowref} type="number" name="paynow" id="paynow" className="form-control" required/>
            </div>
            <div className="form-group col py-3">
                <label htmlFor="bank">Bank Account</label>
                <input ref={bankref} type="number" name="bank" id="bank" className="form-control" required/>
            </div>
            {showPermit ? <WorkPermit/> : <ShowBlank/>}
            <button type="submit" className="blue-btn" id='submit'>Add Employee</button>
            </form>
        </div>
    </div>
    </> );
}
 
export default AddEmployee;