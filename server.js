const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const port = 3000

const db_name = path.join(__dirname, "bead.db")
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful connention to the database 'bread.db'")
})

// let db = new sqlite3.Database('', sqlite3.OPEN_READWRITE);

app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.render('index'))

app.get('/add', (req, res) => res.render('add'))



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))