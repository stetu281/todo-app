const todos = [
    { "title": "Auto saugen", "completed": 0 },
    { "title": "Steuererklärung machen", "completed": 0 },
    { "title": "Kleider waschen", "completed": 0 }
];

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3000;

app.get('/todos', (req, res) => {
    res.send(todos);
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});