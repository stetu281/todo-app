let todos = [];

const tod = [
    { "title": "Auto saugen", "completed": 0 },
    { "title": "Steuererklärung machen", "completed": 1 },
    { "title": "Kleider waschen", "completed": 0 }
];

import express, { response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get('/todos', (req, res) => {

    const status = parseInt(req.query.checked);

    if (status === 1) {
        res.send(todos.filter(todo => todo.checked === true));
    } else if (status === 0) {
        res.send(todos.filter(todo => todo.checked === false));
    } else {
        res.send(todos);
    }
    
});

app.put('/todos', (req, res) => {
    todos = req.body;
    console.log(todos);
    res.send(todos);
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});