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
    let sql = 'SELECT * FROM bread'

    db.all(sql, (err, rows) => {

        if (err) {
            return res.send(err);
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

app.post('/add', (req, res) =>{
    let hasil = req.body;
    db.serialize(() => {
        let sql = ('INSERT INTO bread (string, integer, float, date, boolean) VALUES(?,?,?,?,?)')
        db.run(sql, [hasil.string, parseInt(hasil.integer), parseFloat(hasil.float), hasil.date, JSON.parse(hasil.boolean)], (err)=>{
            if (err){
                throw err;
            }
            res.redirect('/')
        })
        
    })
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))