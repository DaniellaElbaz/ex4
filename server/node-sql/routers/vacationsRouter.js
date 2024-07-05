const { Router } = require('express');
const { vacationsController } = require('../controllers/vacationsController.js');

const vacationsRouter = new Router();
vacationsRouter.put('/update', vacationsController.updateVacationDetails);
vacationsRouter.post('/choose', vacationsController.chooseVacation);
vacationsRouter.post('/book', vacationsController.bookVacation);
module.exports = { vacationsRouter };