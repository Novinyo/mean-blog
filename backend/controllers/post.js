const Post = require('../models/post');
// CREATE post
exports.createPost = (req, res, next) => {

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
     }).catch(error => {
         message: 'Post creation failed'
     });
}
// UPDATE post
exports.updatePost = (req, res, next) => {
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
        if(result.n > 0)
            res.status(200).json({message: 'Update successful'});
        else 
            res.status(401)
            .json({message: 'You are not authorized to modify this record'});
    });
}

// DELETE by id
exports.deleteById = (req, res, next) => {
    
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {  
        if(result.n > 0)      
            res.status(200).json({message: 'Post deleted'});
            else 
            res.status(401)
            .json({message: 'You are not authorized to delete this record'});
    })
    .catch(error => {
        res.status(500).json({
            message: 'could not delete post'
        })
    });
    
}

// GET all
exports.allPost = (req, res, next) => {
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
    }).catch(error => {
        res.status(500).json({
            message: 'could not load posts'
        })
    });   
}

// GET by id
exports.getById = (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    }).catch(error => {
        res.status(500).json({
            message: 'could not retrieve post'
        })
    });
   
}