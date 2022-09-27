const express = require('express');
const app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors');
const { request } = require('express');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nn@84564519',
    database: 'porousway'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.listen(3001, () => {
    console.log('running on port 3001');
});


app.get('/api/getEmployeeList', (req, res) => {
    const sqlSelect = "select e.employee_id, `status`,`name`,IC_number, e.work_permit_no, wp.end_date as expiry_date, birthday, department, e.position, ed.start_date, salary, email, phone_No, PayNow_No, bank_acc from employee e "+
    "left join employee_detail ed on e.employee_id = ed.id "+
    "left join workpermit wp on e.work_permit_no = wp.work_permit_no "+
    "left join position p on e.position = p.position "+
    "group by id, e.position "+
    "order by id "
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
})

app.get('/api/getLeave', (req, res) => {
    const sqlSelect = "select employee_id, name, paid_leave, medical_leave, compassionate_leave from employee e "+
    "join employee_detail ed on e.employee_id = ed.id "+
    "where status = 'active' "+
    "group by employee_id"
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
})

app.post('/api/submitRequest', (req, res) => {
    const employee_id = req.body.employee_id;
    const type_of_request = req.body.leavetype;
    const days = req.body.days;
    const from_date = req.body.from_date;
    const to_date = req.body.to_date;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const sqlInsert = "INSERT INTO porousway.request (`employee_id`,`number_of_days`, `type_of_request`, `date_of_request`, from_date, to_date) VALUES (?,?, ?, ?, ?, ?)"
    db.query(sqlInsert, [employee_id, days, type_of_request, today, from_date, to_date], (err, result)=>{
        if(err == null){
            res.send("OK")
        }else{
            res.send(err)
            console.log(err)
        }
    })
})

app.get('/api/getListOfRequest', (req, res)=>{
    const sqlSelect = "SELECT employee_id, name, type_of_request, from_date, to_date, number_of_days, date_of_request FROM request r "+
    "right join employee_detail ed on r.employee_id = ed.id "+
    "where r.status = 'pending' and ed.status = 'active'"

    db.query(sqlSelect, (err, result)=>{
        res.send(result)
    })
})

app.get('/api/getDashboardData', (req, res) => {
    const sqlSelect = "select e.employee_id, ed.status as status, `name`, IC_number, null as work_permit_no, null as expiry_date, type_of_request, from_date, to_date, (null) as documents, null as `type`, null as expiry_date from employee e "+
    "left join employee_detail ed on e.employee_id = ed.id "+
    "left join position p on e.position = p.position "+
    "right join request r on e.employee_id = r.employee_id "+
	"where ed.status ='active' and r.status = 'pending'"+
    "union all " +
    "select e.employee_id, ed.status as status,`name`,IC_number, e.work_permit_no, wp.end_date as expiry_date, null as type_of_request, null as from_date, null as to_date, (null) as documents, null as `type`, null as expiry_date from employee e "+
    "left join employee_detail ed on e.employee_id = ed.id "+
    "left join workpermit wp on e.work_permit_no = wp.work_permit_no "+
	"where end_date-curdate() < 90 "+
    "group by e.work_permit_no "+
	"union all "+
    "select null as employee_id, null as status, null as `name`, null as IC_number, null aswork_permit_no, null as expiry_date, null as type_of_request, null as from_date, null as to_date, documents, `type`, expiry_date from corporate_documents_expiry "+
	"where expiry_date-curdate() < (reminder * 30)"
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
})

app.post('/api/insert', (req, res) => {
    const employee_id = req.body.employee_id
    const position = req.body.position

    const sqlInsert = "INSERT INTO employee (employee_id, position) VALUES (?,?)"
    db.query(sqlInsert, [employee_id, position], (err, result) => {
    });
})

app.post('/api/approveRequest', (req, res) => {
    const id = req.body.id
    const type_of_request = req.body.type
    const status = req.body.status
    const sqlUpdate = "update request r, employee_detail ed set r.status = '"+status+"' , ed."+ type_of_request + "= ed." + type_of_request + " - r.number_of_days " +
    "where r.employee_id = "+ id + " "+ " and r.type_of_request = '" + 
    type_of_request + "' and ed.id = r.employee_id"
    db.query(sqlUpdate, (err, result) => {
        if(err == null){
            res.send("OK")
        }else{
            console.log(err)
            res.send(err)
        }
    });
})

app.get('/api/corporateExpiry', (req, res) => {
    const sqlSelect = "select * from corporate_documents_expiry order by type"
    db.query(sqlSelect, (err, result) => {
        if(err == null){
            res.send(result)
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

app.post('/api/updateCorporateExpiry', (req, res) =>{
    const document = req.body.document
    const expiry_date = req.body.expiry_date
    const reminder = req.body.reminder
    const type = req.body.type
    const sqlUpdate = "update corporate_documents_expiry "+
    "set expiry_date = '"+expiry_date+"', reminder='"+reminder+
    "' where documents = '"+document+"' and type = '"+type+"'"

    db.query(sqlUpdate, (err, result) => {
        if(err == null){
            res.send("OK")
        }else{
            console.log(err)
            res.send(err.message)
        }
    })
})