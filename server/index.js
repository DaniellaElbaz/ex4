const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const vacationData = require('./data/vacation.json');
app.get("/vacation", (req, res) => {
 res.json(vacationData);
});
app.listen(port);
console.log(`listening on port ${port}`);