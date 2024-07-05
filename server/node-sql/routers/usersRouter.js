const { Router } = require('express');
const { usersController } = require('../controllers/usersController.js');

const usersRouter = new Router();
usersRouter.get('/', usersController.getUsers);
usersRouter.post('/add', usersController.addUser);
usersRouter.post('/AccessCode', usersController.getUserByAccessCode);

module.exports = { usersRouter };