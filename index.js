require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
const vacationData = require('./data/vacation.json');
const { vacationsRouter } = require('./routers/vacationsRouter.js');
const { usersRouter } = require('./routers/usersRouter.js');

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE",
        'Content-Type': 'application/json'
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/vacation", (req, res) => {
    res.json(vacationData);
});

app.use('/api/vacations', vacationsRouter);
app.use('/api/users', usersRouter);


app.use((req, res) => {
    console.error('Path not found:', req.path);
    res.status(400).send('something is broken!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});