const express = require('express');
const app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors');

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
    const sqlSelect = "SELECT * FROM employee";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
})

app.get('/api/getDashboardData', (req, res) => {
    const sqlSelect = "SELECT employee_id, e.work_permit_no, end_date, name FROM employee e "+
    "RIGHT JOIN workpermit wp ON e.work_permit_no = wp.work_permit_no "+
    "join employee_detail ed on e.employee_id = ed.id "+
    "WHERE end_date-curdate() < 90 "+
    "GROUP by e.work_permit_no;";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
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