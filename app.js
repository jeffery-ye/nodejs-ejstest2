const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const ejs = require('ejs')

app.use(bodyParser.urlencoded( {extended: false}))
app.set('view engine', 'ejs')

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
    res.sendFile(path.join(__dirname + '/views/form.html'))
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
    res.sendFile(path.join(__dirname + '/views/outputform.html'))
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




app.listen(3012, () => console.log("App Running on 3012"))