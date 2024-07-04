require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const { postsController } = require('./controllers/postsController.js');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
 res.set('Access-Control-Allow-Origin', '*');
 res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
 res.set('Content-Type', 'application/json');
 next();
});
app.get("/posts", async (req, res) => {
 res.status(200).send(await postsController.getPosts());
});
app.listen(port);
console.log(`listening on port ${port}`);