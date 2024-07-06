const { Router } = require('express');
const { usersController } = require('../controllers/usersController.js');

const usersRouter = new Router();
usersRouter.get('/', usersController.getUser);
usersRouter.post('/add', usersController.addUser);

module.exports = { usersRouter };