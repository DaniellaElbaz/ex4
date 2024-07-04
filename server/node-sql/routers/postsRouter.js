const { Router } = require('express');
const { postsController } = require('../controllers/postsController.js');

const postsRouter = new Router();

postsRouter.get('/', postsController.getPosts);          
postsRouter.get('/:postId', postsController.getPost);
postsRouter.post('/', postsController.addPost);
postsRouter.put('/:postId', postsController.updatePost);

module.exports = { postsRouter };
