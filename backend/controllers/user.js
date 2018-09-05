const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/auth');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
        .then(result => { 
            res.status(201).json({
                message: 'User created!',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            });
        });
    });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(user => {
        
        if(!user) {
            return res.status(401).json({
                message: 'Email or password incorrect!'
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        console.log(result);
        if(!result) {
            return res.status(401).json({
                message: "Email or password incorrect!"
            });
        }
        const token = jwt.sign(
            {
                email: fetchedUser.email,
                 userId: fetchedUser._id
            },
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid authentication credentials"
        });
    })
}

exports.checkEmail = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        
        if(user) {
            return res.status(200).json({
                message: '1'
            })
        } else {
            return res.status(200).json({
                message: '0'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            message: "An error occured"
        });
    })
}