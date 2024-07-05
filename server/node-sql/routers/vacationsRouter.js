const { Router } = require('express');
const { vacationsController } = require('../controllers/vacationsController.js');

const vacationsRouter = new Router();

vacationsRouter.post('/choose', vacationsController.chooseVacation);

module.exports = { vacationsRouter };