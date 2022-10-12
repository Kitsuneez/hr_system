const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')()
const app = express();
const mysql = require('mysql')
const cors = require('cors');
const e = require('express');

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(pino)
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nn@84564519',
    database: 'porousway',
    multipleStatements: true
})

db.connect(function(err){
    if(err) throw err;
    console.log("connected to database");
    db.query("CREATE DATABASE IF NOT EXISTS porousway", function(err, result){
        if(err) throw err;
    })
    const sqlCreate = "begin;"+
        "CREATE TABLE IF NOT EXISTS `corporate_documents_expiry` ("+
            "`documents` varchar(45) NOT NULL,"+
            "`type` varchar(45) NOT NULL,"+
            "`expiry_date` date DEFAULT NULL,"+
            "`reminder` int NOT NULL,"+
            "PRIMARY KEY (`documents`,`type`)"+
        ");"+
        "CREATE TABLE IF NOT EXISTS`employee` ("+
            "`employee_id` int NOT NULL,"+
            "`position` varchar(45) NOT NULL,"+
            "PRIMARY KEY (`position`,`employee_id`)"+
        ");"+
        "CREATE TABLE IF NOT EXISTS`employee_detail` ("+
            "`id` int NOT NULL AUTO_INCREMENT,"+
            "`status` varchar(45) NOT NULL DEFAULT 'active',"+
            "`name` varchar(45) NOT NULL,"+
            "`IC_number` varchar(9) NOT NULL,"+
            "`birthday` date NOT NULL,"+
            "`salary` decimal(7,2) NOT NULL,"+
            "`email` varchar(45) NOT NULL,"+
            "`phone_no` varchar(8) NOT NULL,"+
            "`PayNow_No` varchar(8) NOT NULL,"+
            "`bank_acc` varchar(15) NOT NULL,"+
            "`paid_leave` int DEFAULT '7',"+
            "`medical_leave` int DEFAULT '14',"+
            "`compassionate_leave` int DEFAULT '2',"+
            "`start_date` date NOT NULL,"+
            "`passport_no` varchar(45) DEFAULT NULL,"+
            "`passport_expiry` date NOT NULL,"+
            "`csoc_expiry` date DEFAULT NULL,"+
            "`forklift_expiry` date DEFAULT NULL,"+
            "`driving_license_expiry` date DEFAULT NULL,"+
            "`coretrade_expiry` date DEFAULT NULL,"+
            "`work_permit_no` varchar(12) DEFAULT NULL,"+
            "`last_reset` date DEFAULT NULL,"+
            "PRIMARY KEY (`id`),"+
            "UNIQUE KEY `IC_number_UNIQUE` (`IC_number`)"+
          ");"+
          "CREATE TABLE IF NOT EXISTS `position` ("+
            "`position` varchar(45) NOT NULL,"+
            "`department` varchar(45) NOT NULL,"+
            "PRIMARY KEY (`position`)"+
          ");"+
          "CREATE TABLE IF NOT EXISTS `request` ("+
            "`employee_id` int NOT NULL,"+
            "`type_of_request` varchar(45) NOT NULL,"+
            "`from_date` date NOT NULL,"+
            "`to_date` date NOT NULL,"+
            "`number_of_days` int NOT NULL,"+
            "`date_of_request` date NOT NULL,"+
            "`status` varchar(45) DEFAULT 'pending',"+
            "PRIMARY KEY (`employee_id`,`type_of_request`,`date_of_request`)"+
          ");"+
          "CREATE TABLE IF NOT EXISTS `workpermit` ("+
            "`work_permit_no` varchar(9) NOT NULL,"+
            "`start_date` date NOT NULL,"+
            "`end_date` date NOT NULL,"+
            "PRIMARY KEY (`work_permit_no`)"+
          "); commit;"
          db.query(sqlCreate, (err, results)=>{
            if(err) throw err
          })
})



app.get('/api/getEmployeeList', (req, res) => {
    const sqlSelect = "select id, `status`,`name`,IC_number, birthday, department, e.position, ed.start_date, salary, email, phone_No, PayNow_No, bank_acc, ed.work_permit_no from employee_detail ed "+
    "left join employee e on ed.id = e.employee_id "+
    "left join position p on e.position = p.position "+
    "order by id "
    db.query(sqlSelect, (err, result) => {
        if(err != null){
            console.log(err)
            res.send([])
        }else{
            res.send(result);
        }
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
  console.log("receieve")
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
    const sqlSelect = "begin;"+
    "select e.employee_id, ed.status as status, `name`, IC_number, null as work_permit_no, null as permit_expiry_date, replace(type_of_request, '_', ' ') as type_of_request, from_date, to_date, (null) as documents, null as `type`, null as expiry_date, null as passport_expiry, null as CSOC_expiry, null as CoreTrade_expiry, null as forklift_expiry, null as driving_license_expiry from employee e "+
    "left join employee_detail ed on e.employee_id = ed.id "+
    "left join position p on e.position = p.position "+
    "right join request r on e.employee_id = r.employee_id "+
	"where ed.status ='active' and r.status = 'pending' "+
    "union all  "+
    "select e.employee_id, ed.status as status,`name`,IC_number, ed.work_permit_no, "+
    "case when datediff(wp.end_date, curdate())< 90 then wp.end_date else null end as permit_expiry_date, null, null, null, null, null, null, "+
    "case when datediff(passport_expiry, curdate())<300 then passport_expiry else null end as passport_expiry, "+
    "case when datediff(CSOC_expiry, curdate())<300 then csoc_expiry else null end as csoc_expiry, "+
    "case when datediff(coretrade_expiry, curdate())<300 then coretrade_expiry else null end as coretrade_expiry, "+
    "case when datediff(forklift_expiry, curdate())<300 then forklift_expiry else null end as forklift_expiry, "+
    "case when datediff(driving_license_expiry, curdate())<300 then driving_license_expiry else null end as driving_license_expiry from employee e "+
    "left join employee_detail ed on e.employee_id = ed.id "+
    "left join workpermit wp on ed.work_permit_no = wp.work_permit_no "+
	"union all "+
    "select null, null, null, null, null, null, null, null, null, documents, `type`, expiry_date , null, null, null, null, null from corporate_documents_expiry "+
	"where datediff(expiry_date,curdate()) <= (reminder * 31); "+
    "update employee_detail "+
    "set paid_leave = if(((7+round(datediff(curdate(), start_date)/365))>14), paid_leave+14, (paid_leave+7+round(datediff(curdate(), start_date)/365))), "+
    "compassionate_leave = 2, medical_leave =14, last_reset = concat(year(curdate()), '-', Month(start_date), '-',day(start_date)) "+
    "where month(start_date) <= month(curdate()) and day(start_date) >= day(curdate()) and year(last_reset) < year(curdate()); "+
    "commit;"
    db.query(sqlSelect, (err, result) => {
      console.log(err)
      console.log(result[0])
        res.send(result[1]);
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

app.post('/api/addEmployee', (req, res) =>{
    const formData = req.body
    const position = formData.position
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    if(formData.forkLiftExpiry == ""){
      var forklift = null
    }else{
      var forklift = formData.forkLiftExpiry
    }
    if(formData.driving == ""){
      var driving = null
    }else{
      var driving = formData.driving
    }
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var sqlInsert = "begin;"
    const after = " insert into employee_detail (name, IC_number, birthday, salary, email, phone_no, payNow_no, bank_acc, start_date, work_permit_no, passport_no, passport_expiry, csoc_expiry, coretrade_expiry, forklift_expiry, driving_license_expiry)"+
    " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
    if(formData.length == 0){
        res.send()
    }else{
        if(formData.permit == ""){
            var employeeValues = []
            var permit = null
            var csoc = null
            var coreTrade = null
            for (var i = 0; i < position.length; i++){
                employeeValues.push(`(last_insert_id(), '${position[i]}')`)
            }
            sqlInsert += after
            sqlInsert += " insert into employee(employee_id, position) values "+employeeValues+";" +" commit;"
            db.query(sqlInsert, [formData.name, formData.ic, formData.birthday, formData.salary, formData.email, formData.phone,formData.paynow, formData.bank, today, permit, formData.passportNo, formData.passportExpiry, csoc, coreTrade, forklift, driving], (err, result) => {
                if(err == null){
                    console.log("added")
                    res.send("OK")
                }else{
                    console.log(err)
                    res.send(err.message)
                }
            });
        }else{
            var employeeValues = []
            var permit = formData.permit
            for (var i = 0; i < position.length; i++){
                employeeValues.push(`(last_insert_id(), '${position[i]}')`)
            }
            sqlInsert += " insert ignore into workpermit(work_permit_no, start_date, end_date) values(?, ?, ?); "+ after
            sqlInsert += " insert into employee(employee_id, position) values "+employeeValues+";"
            " commit;"
            db.query(sqlInsert, [permit, formData.start, formData.expire, formData.name, formData.ic, formData.birthday, formData.salary, formData.email, formData.phone,formData.paynow, formData.bank, today, permit, formData.passportNo, formData.passportExpiry, formData.csoc, formData.coreTrade, forklift, driving], (err, result) => {
                if(err == null){
                    console.log("added")
                    res.send("OK")
                }else{
                    console.log(err)
                    res.send(err.message)
                }
            });
        }
    }
})

app.get('/api/getDepartment', (req, res) => {
    var sqlSelect = "SELECT * from position order by department"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get('/api/updateEmployee/:id', (req, res) => {
    var id = req.params.id
    var sqlSelect = "SELECT * from employee_detail ed "+
    " left join employee e on ed.id = e.employee_id"+
    " left join workpermit wp on ed.work_permit_no = wp.work_permit_no"+
    " where id=?"
    db.query(sqlSelect, [id], (err, result) => {
        res.send(result)
    })
})

app.post('/api/updateEmployee/:id', (req, res)=> {
    var id = req.params.id
    const formData = req.body
    if(formData.length == 0){
        res.send("Empty")
    }else{
        const position = formData.position
        var birthday = formData.birthday
        var start = formData.start
        var end = formData.expire
        if(birthday.includes('"')){
            birthday = birthday.replace('"', '')
        }
        birthday = birthday.split('T')
        if(start == undefined){
            start = null
        }else{
            start = start.split('T')
            start = start[0]
        }
        if(end == undefined){
            end = null
        }else{
            end = end.split('T')
            end = end[0]
        }
    
        if(formData.permit === ""){
            var employeeValues = []
            var permit = formData.permit
            for (var i = 0; i < position.length; i++){
                employeeValues.push(`(${id}, '${formData.position[i]}')`)
            }
            var sqlInsert = 
            "begin;"+
            "insert into employee (employee_id, position) values "+employeeValues+
            "; update employee_detail set name=?, IC_number=?, birthday=?, salary=?, email=?, phone_no=?, PayNow_No=?, bank_acc=? where id=?; "+
            "commit;"
        }else{
            var employeeValues = []
            var permit = formData.permit
            for (var i = 0; i < position.length; i++){
                employeeValues.push(`(${id}, '${position[i]}')`)
            }
            var sqlInsert = 
            "begin;"+
            "insert into workpermit (work_permit_no, start_date, end_date) values (?, ?, ?)  on duplicate key update start_date =?, end_date=?; "+
            "insert ignore into employee (employee_id, position) values "+employeeValues+" "+
            ";update employee_detail set name=?, IC_number=?, birthday=?, salary=?, email=?, phone_no=?, PayNow_No=?, bank_acc=?, work_permit_no=? where id=?; "+
            "commit;"
        }
        db.query(sqlInsert,[
            permit,
            start,
            end,
            start,
            end,
            formData.name,
            formData.ic,
            birthday[0],
            formData.salary,
            formData.email,
            formData.phone,
            formData.paynow,
            formData.bank,
            permit,
            id],
            (err, result) => {
                if(err== null){
                    res.send("OK")
                }else{
                    console.log(err)
                    res.send(err)
                }
        })
    }
})

app.get('/api/getIndivExpiry', (req, res) => {
    const sqlSelect = "select id, name, end_date, CSOC_expiry, coreTrade_expiry, passport_expiry, forklift_expiry, driving_license_expiry from employee_detail ed "+
    "left join workpermit w on ed.work_permit_no = w.work_permit_no group by id order by id"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.post('/api/addCorporateExpiry', (req, res)=>{
    const name = req.body.document
    const type = req.body.type
    const expiry_date = req.body.expiry_date
    const reminder = req.body.reminder
    const sqlSelect = "insert into corporate_documents_expiry values(?,?,?,?)"
    db.query(sqlSelect, [name, type, expiry_date, reminder], (err, result) => {
        if(err == null){
            res.send("OK")
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

app.post('/api/updateStatus', (req, res)=>{
    const status = req.body.status
    const id = req.body.id
    console.log(status)
    const sqlUpdate = "UPDATE employee_detail set status = ? where id = ?"
    db.query(sqlUpdate, [status, id], (err, result) => {
        if(err == null){
            console.log(result)
            res.send("OK")
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

app.listen(3001, () =>
console.log('Express server is running on localhost:3001')
);