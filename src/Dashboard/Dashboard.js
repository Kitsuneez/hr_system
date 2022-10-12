import { useEffect, useState } from 'react';
// import Axios from 'axios';
import './Dashboard.css'
import Moment from 'react-moment'
import $ from 'jquery';

const Dashboard = () => {
    const [dashboard, setdashboard] = useState([])
    useEffect(()=>{
        $.ajax({
            type: "GET",
            url: "http://localhost:3001/api/getDashboardData",
            processData: true,
            success: function(data) {
                setdashboard(data)
                console.log(data)
            }
        })
      }, [])

    const LicenseExpiry = ({name, type, date}) =>{
        return (
            <div className="container rows">
                {name}
                    <div className="value-right">
                        {type}<br />
                        <Moment format="DD/MM/YYYY" className="Date">{date}</Moment>
                    </div>
                <hr className='w-100'/>
            </div>
        )
    }


    return ( 
        <>
            <div className="container">
                <div className="row">
                    <div className="col container dashboard shadow">
                        <p>Company License Expiry</p>
                    </div>
                    <div className="col container dashboard shadow">
                        <p>Worker License Expiry</p>
                    </div>
                    <div className="col container dashboard shadow">
                        <p>Worker Permit Expiry</p>
                    </div>
                </div>
                <div className="row" height="1000px">
                    <div className="col container data-box">
                        {dashboard.map((val)=>{
                            if(val.type !== "Insurance" && val.type != null){
                                return (
                                    <>
                                    <div className="container rows">
                                        {val.documents}
                                            <div className="value-right">
                                                {val.type}<br />
                                                <Moment format="DD/MM/YYYY" className="Date">{val.expiry_date}</Moment>
                                            </div>
                                    <hr className='w-100'/>
                                    </div>
                                </>
                                )
                            }else{
                                return null;
                            }
                        })}
                    </div>
                    <div className="col container data-box">
                        {dashboard.map((val)=>{
                            if(val.passport_expiry!=null){
                                return(
                                    <LicenseExpiry name={val.name} date={val.passport_expiry} type={"passport"}/>
                                    )
                            }else if(val.csoc_expiry != null){
                                return(
                                    <LicenseExpiry name={val.name} date={val.csoc_expiry} type={"CSOC"}/>
                                    )
                            }else if(val.coretrade_expiry != null){
                                return (
                                    <LicenseExpiry name={val.name} date={val.coretrade_expiry} type={"CoreTrade"}/>
                                )
                            }else if(val.forklift_expiry != null){
                                return (
                                    <LicenseExpiry name={val.name} date={val.forklift_expiry} type={"ForkLift License"}/>
                                )
                            }else if(val.driving_license_expiry != null){
                                return (
                                    <LicenseExpiry name={val.name} date={val.driving_license_expiry} type={"Driving License"}/>
                                )
                            }else{
                                return null;
                            }
                        })}
                    </div>
                    <div className="col container data-box">
                        {dashboard.map((val)=>{
                            if(val.permit_expiry_date != null){
                                return(
                                    <LicenseExpiry name={val.name} date={val.permit_expiry_date} type={val.work_permit_no}/>
                                )
                            }else{
                                return null;
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col container dashboard shadow">
                        <p>Insurance Expiry</p>
                    </div>
                    <div className="col container dashboard shadow">
                        <p>Pending Claims Approval</p>
                    </div>
                    <div className="col container dashboard shadow">
                        <p>Pending Leave Approval</p>
                    </div>
                </div>
                <div className="row" height="1000px">
                    <div className="col container data-box">
                    {dashboard.map((val)=>{
                            if(val.type === "Insurance"){
                                return (
                                    <>
                                    <div className="container rows">
                                        {val.documents}
                                            <div className="value-right">
                                                {val.type}<br />
                                                <Moment format="DD/MM/YYYY" className="Date">{val.expiry_date}</Moment>
                                            </div>
                                    <hr className='w-100'/>
                                    </div>
                                </>
                                )
                            }else{
                                return null;
                            }
                        })}
                    </div>
                    <div className="col container data-box">
                        <p></p>
                    </div>
                    <div className="col container data-box">
                    {dashboard.map((val)=>{
                            if(val.type_of_request != null){
                                return(
                                <>
                                    <div className="container rows">
                                        {val.name}
                                            <div className="value-right">
                                                <div className="request">{val.type_of_request}</div>
                                                <Moment format="DD/MM/YYYY" className="Date">{val.from_date}</Moment> to <Moment className="Date"format="DD/MM/YYYY">{val.to_date}</Moment>
                                            </div>
                                    <hr className='w-100'/>
                                    </div>
                                </>)
                            }else{
                                return null;
                            }
                        })}
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default Dashboard;