const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'ejs')

//app.set('views', path.join(__dirname + 'views'));

app.get('/', (req, res) => {
    res.render('index.ejs')
})

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'siyuan',
    password: 'siyuan05',
    database: 'nodejs'
})

function getConnection() {
    return pool
}

app.get('/usersearch', (req, res) => {
    res.render('users/usersearch.ejs')
    console.log("Connected to Form")
})

app.post('/usersearchresults', (req, res) => {
    const con = getConnection()
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const users = [{}]
    const sql = "SELECT * FROM users WHERE first_name = ? or last_name = ?"
    con.query(sql, [firstName, lastName], (err, rows) => {
        if (err) {
            sendstatus(500)
            console.log("Failed to find user")
            return
        }
        rows.map((row) => {
            const user = { firstName: row.first_name, lastName: row.last_name }
            users.push(user)
        })
        console.log(users[1])
        res.render('users/usersearchresults.ejs', { users: users })
    })
})


app.get('/surveysearchform', (req, res) => {
    res.render('survey/surveysearchform.ejs')
    console.log("Connected to survey search form")
})

app.post('/surveysearch', (req, res) => {
    const con = getConnection()
    const firstName = req.body.first_name
    const userAge = req.body.age
    const newuser = [{}]

    const sql1 = "SELECT name, age FROM survey WHERE name = ? or age = ?"
    con.query(sql1, [firstName, userAge], (err, rows) => {
        if (err) {
            sendstatus(500)
            return
        }
        rows.map((row) => {
            const user = { firstName: row.name, userAge: row.age }
            newuser.push(user)
        })

        res.render('survey/surveysearchresults.ejs', { newuser: newuser })

    })
})


app.get('/createnewuser', (req, res) => {
    res.render('users/createuser.ejs')

})

app.post('/createuseroutput', (req, res) => {
    const con = getConnection()
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    //NOTE: Select check if the username already exists. IF not, continue. Otherwise, return an error "User already exists"
    const sql = "INSERT INTO users (first_name, last_name) values (?,?)"
    con.query(sql, [firstName, lastName], (err, rows) => {
        const user = { user: { "firstName": firstName } }
        //const user = {user: {firstName: row.first_name}}
        res.render('users/createuseroutput.ejs', user)
    })
})

app.get('/survey', (req, res) => {
    res.render('survey/survey.ejs')
    console.log('Connected to SQL Survey')
})
app.post('/surveyoutput', (req, res) => {
    const con = getConnection()
    const firstName = req.body.name
    const userAge = req.body.age
    const sql = "INSERT INTO survey (name, age) values (?,?)"
    con.query(sql, [firstName, userAge], (err, rows) => {
        if (err) {
            sendstatus(500)
            console.log("Failed to create user")
            return
        }

    })

    const sql2 = "SELECT * FROM survey WHERE name = ? limit 1"
    con.query(sql2, [firstName], (err, rows) => {
        rows.map((row) => {
            const user = { user: { firstName: row.name } }
            res.render('survey/surveyoutput.ejs', user)
        })


    })
})

app.listen(3013, () => console.log("App Running on 3013"))