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
    console.log("recieved")
    const sqlSelect = "SELECT * FROM employee";
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