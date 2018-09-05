const express = require('express');

const PostController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

// Create a new Post
router.post('', checkAuth, extractFile,PostController.createPost);
//update a post
router.put('/:id', checkAuth, extractFile, PostController.updatePost)
// get all posts
router.get('',PostController.allPost);

// get all posts
router.get('/:id',PostController.getById);

// delete a post
router.delete('/:id', checkAuth, PostController.deleteById);

module.exports = router;