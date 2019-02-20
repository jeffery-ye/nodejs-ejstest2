const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')

app.use(bodyParser.urlencoded( {extended: false}))
app.set('view engine', 'ejs')

//app.set('views', path.join(__dirname + 'views'));

app.get('/', (req,res) => {
    res.render('./index.ejs')
})

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'siyuan',
    password: 'siyuan05',
    database: 'nodejs'
})

function getConnection(){
    return pool
}

app.get('/form', (req, res) => {
    res.render('form.ejs')
    console.log("Connected to Form")
})

app.post('/test', (req, res) => {
    const con = getConnection()
    const firstName = req.body.first_name
    const sql = "SELECT * FROM users WHERE first_name = ? limit 1"
    con.query(sql, [firstName], (err, rows) => {
        if (err) {
            sendstatus(500)
            console.log("Failed to find user")
            return
        }
    rows.map((row) => {
        const user = {user: {firstName: row.first_name}}
        res.render('test.ejs', user)
        })
        
    })
})


app.get('/create', (req, res) => {
    res.render('outputform.ejs')
    console.log("Connected to Output Form")
})

app.post('/output', (req, res) => {
    const con = getConnection()
    const firstName = req.body.first_name
    const sql = "INSERT INTO users (first_name) values (?)"
    con.query(sql, [firstName], (err, rows) => {
        const user = {user: {"firstName": firstName}}
        //const user = {user: {firstName: row.first_name}}
        res.render('output.ejs', user)
    })        
})

app.use(express.static(__dirname + '/assets'));


app.listen(3013, () => console.log("App Running on 3013"))