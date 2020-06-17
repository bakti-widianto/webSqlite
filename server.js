const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const port = 3000

const db_name = path.join(__dirname, "bread.db")
const db = new sqlite3.Database(db_name, (err) => {
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

app.get('/', (req, res) => {
    let dataSearch = []
    let search = false

    if (req.query.checkId && req.query.id) {
        dataSearch.push(`id = ${req.query.id}`)
        search = true
    }

    if (req.query.checkString && req.query.string) {
        dataSearch.push(`string = ${req.query.string}`)
        search = true
    }
    
    if (req.query.checkInteger && req.query.integer) {
        dataSearch.push(`integer = ${req.query.integer}`)
        search = true
    }

    if (req.query.checkFloat && req.query.float) {
        dataSearch.push(`float = ${req.query.float}`)
        search = true
    }

    if (req.query.checkDate && req.query.startDate && req.query.endDate) {
        dataSearch.push(`date BETWEEN '${req.query.startDate}' AND '${req.query.endDate}`)
        search = true
    }

    if (req.query.checkBoolean && req.query.boolean) {
        dataSearch.push(`boolean = ${req.query.boolean}`)
        search = true
    }
    

    console.log(dataSearch)

    let sql = 'SELECT * FROM bread'

    db.all(sql, (err, rows) => {

        if (err) {
            return console.error(err.message)
        } else if (rows == 0) {
            return res.send('data can not be found');
        } else {
            let data = [];
            rows.forEach(row => {
                data.push(row);
            });
            // console.log(data)
            res.render('index', { data })

        }
    })
})

app.get('/add', (req, res) => {
    res.render('add');
})

app.post('/add', (req, res) => {
    let hasil = req.body;
    db.serialize(() => {
        let sql = ('INSERT INTO bread (string, integer, float, date, boolean) VALUES(?,?,?,?,?)')
        db.run(sql, [hasil.string, hasil.integer, hasil.float, hasil.date, hasil.boolean], (err) => {
            if (err) {
                return console.error(err.message)
            }
            res.redirect('/')
        })

    })
})

app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM bread WHERE id = ?'
    db.run(sql, id, (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    let id = req.params.id
    let sql = 'SELECT * FROM bread WHERE id = ?'
    db.get(sql, id, (err, row) => {
        if (err) {
            return console.error(err.message)
        }
        res.render('edit', { row })
        // console.log(row)
    })
})
app.post('/edit/:id', (req, res) => {
    let id = req.params.id
    let edit = [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean, id]
    let sql = 'UPDATE bread SET string = ? , integer = ? , float = ? , date = ? , boolean = ? WHERE id = ?'

    db.run(sql, edit, (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/')
    })
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))