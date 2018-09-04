const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];

        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
let limits = {fileSize: 2 * 1024 * 1024};

// Create a new Post
router.post('', checkAuth, multer({'storage': storage, limits})
    .single('image'),(req, res, next) => {

    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });

     post.save().then(result => {
         res.status(201).json({
             message: 'Post added successfully',
             returnedPost: {
                 ...result,
                 id: result._id
            }
         });
     });
});
//update a post
router.put('/:id', checkAuth,
 multer({'storage': storage, limits})
.single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
        if(result.nModified > 0)
            res.status(200).json({message: 'Update successful'});
        else 
            res.status(401)
            .json({message: 'You are not authorized to modify this record'});
    });
})
// get all posts
router.get('',(req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery
    .then(documents => {
        fetchedPosts = documents;
        return Post.count();
    })
    .then(count => {
        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    });
   
});

// get all posts
router.get('/:id',(req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    });
   
});

// delete a post
router.delete('/:id', checkAuth, (req, res, next) => {
    
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {  
        if(result.n > 0)      
            res.status(200).json({message: 'Post deleted'});
            else 
            res.status(401)
            .json({message: 'You are not authorized to delete this record'});
    });
    
});

module.exports = router;