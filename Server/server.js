const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer();

const cors = require('cors');

const Database = require('better-sqlite3');
const db = new Database('Database/Chinook_Sqlite.sqlite');

app.use(express.json());
app.use(cors({origin:'*'}));

app.set('port', process.env.PORT || 9999);

app.get('/track', (req, res) => {
    const statement = db.prepare(`SELECT * FROM Track WHERE Composer != 'NULL' AND TrackId > 3000 ORDER BY TrackId`);
    const result = statement.all();
    res.json(result);
});

app.post('/track',upload.none(),(req,res)=>{
    const sql = `INSERT INTO Track(Name,Composer,MediaTypeId,Milliseconds,UnitPrice) VALUES(?,?,?,?,?)`;
    const statement = db.prepare(sql);
    const result = statement.run([req.body.Name,req.body.Composer,req.body.MediaTypeId,req.body.Milliseconds,req.body.UnitPrice]);
    res.json(result);
});

app.put('/track/:id',(req,res)=>{
    const statement = db.prepare(`UPDATE Track SET Name=?,Composer=?,MediaTypeId=?,Milliseconds=?,UnitPrice=? WHERE TrackId=?`);
    statement.run([req.body.Name,req.body.Composer,req.body.MediaTypeId,req.body.Milliseconds,req.body.UnitPrice,req.params.id]);
    res.end();
});

app.delete('/track/:id',(req,res)=>{
    const sql = `DELETE FROM Track WHERE TrackId=?`;
    const statement = db.prepare(sql);
    statement.run([req.params.id]);
    res.end();
});

app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
});