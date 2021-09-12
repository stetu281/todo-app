import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});

app.get('/todos', async (req, res) => {
    const [todos] = await connection.query(`
        SELECT id, title, completed FROM task
    `);
    res.status(200);
    res.send(todos);
});

app.post('/todos', async (req, res) => {
    if(!req.body) {
        res.status(400);
        res.send({error: "body is missing"});
        return;
    }
    if(!req.body.title) {
        res.status(400);
        res.send({error: "title is missing"});
        return;
    }
    if(typeof req.body.completed == "undefined" || typeof req.body.completed != "number") {
        res.status(400);
        res.send({error: "completed is missing or not a number"});
        return;
    }

    const [result] = await connection.execute(`
        INSERT INTO task (title, completed) VALUES (?, ?)
    `, [req.body.title, req.body.completed]);

    const [todos] = await connection.query(`
        SELECT id, title, completed FROM task WHERE id = ?
    `, [result.insertId]);

    res.status(201);
    res.send(todos);
})

app.put('/todos/:id', async (req, res) => {

    const [result] = await connection.execute(`
        UPDATE task SET completed = ? WHERE id = ?
    `, [req.body.completed, req.params.id]);

    const [todos] = await connection.query(`
        SELECT id, title, completed FROM task WHERE id = ?
    `, [req.params.id]);

    res.status(201);
    res.send(todos);
});

app.delete('/todos/:id', async (req, res) => {
    await connection.execute(`
        DELETE FROM task WHERE id = ?
    `, [req.params.id]);

    res.sendStatus(204);
});


const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const shutdownHandler = () => {
    console.log('closing all connections...');
    server.close(() => {
        connection.destroy();
        console.log('shutting down...');
        process.exit();
    });
};
process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);
