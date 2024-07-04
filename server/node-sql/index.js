require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
const vacationData = require('./data/vacation.json');
const { postsRouter } = require('./routers/postsRouter.js');

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
app.use('/api/posts', postsRouter);


app.use((req, res) => {
    res.status(400).send('something is broken!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});