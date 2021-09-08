const todos = [
    { "title": "Auto saugen", "completed": 0 },
    { "title": "Steuererklärung machen", "completed": 1 },
    { "title": "Kleider waschen", "completed": 0 }
];

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3000;

app.get('/todos', (req, res) => {

    const status = parseInt(req.query.completed);

    if (status === 1) {
        res.send(todos.filter(todo => todo.completed === 1));
    } else if (status === 0) {
        res.send(todos.filter(todo => todo.completed === 0));
    } else {
        res.send(todos);
    }
    
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});