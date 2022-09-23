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
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    const sqlInsert = "INSERT INTO porousway.request (`employee_id`,`number_of_days`, `type_of_request`, `date_of_request`) VALUES (?,?, ?, ?)"
    db.query(sqlInsert, [employee_id, days, type_of_request, today], (err, result)=>{
        console.log(result);
        console.log(err);
        if(err == null){
            res.send("OK")
        }
        res.send(err)
        return result
    })
})

app.get('/api/getDashboardData', (req, res) => {
    const sqlSelect = "SELECT employee_id, e.work_permit_no, end_date, name FROM employee e "+
    "RIGHT JOIN workpermit wp ON e.work_permit_no = wp.work_permit_no "+
    "join employee_detail ed on e.employee_id = ed.id "+
    "WHERE end_date-curdate() < 90 "+
    "GROUP by e.work_permit_no;";
    db.query(sqlSelect, (err, result) => {
    });
})

app.post('/api/insert', (req, res) => {
    const employee_id = req.body.employee_id
    const position = req.body.position

    const sqlInsert = "INSERT INTO employee (employee_id, position) VALUES (?,?)"
    db.query(sqlInsert, [employee_id, position], (err, result) => {
        console.log(result)
    });
})