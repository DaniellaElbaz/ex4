const { Router } = require('express');
const { postsController } = require('../controllers/postsController.js');

const postsRouter = new Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', postsController.addPost);
postsRouter.put('/:id', postsController.updatePost);

module.exports = { postsRouter };
