const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

/*----- Sign new account ---- */
router.post('/signup', function(req, res) {

	User.findOne({email: req.body.email})
		.exec()
		.then(function(user) {
			res.status(500).json({
				error: 'Email is already used',
				user:user.name
			});
		})
		.catch(error => {
			bcrypt.hash(req.body.password, 10, function(err, hash){
				if(err) {
					return res.status(500).json({
						error: err
					});
				}
				else {
					const user = new User({
						_id: new  mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash,
						userId: '_' + Math.random().toString(36).substr(2, 14)+req.body.email
					});

					user.save().then(function(result) {
						console.log("result!");
						res.status(200).json({
							success: 'New user has been created'
						});
					})
				}
			});
		});

});

module.exports = router;

/*----- Sign in the user  ---- */
router.post('/signin', function(req, res){
    User.findOne({email: req.body.email})
        .exec()
        .then(function(user) {
            bcrypt.compare(req.body.password, user.password, function(err, result){
                if(err) {
                    return res.status(401).json({
                        error: 'Unauthorized Access'
                    });
                }
                if(result) {
                    const JWTToken = jwt.sign({
                            email: user.email,
                            _id: user._id
                        },
                        'secret',
                        {
                            expiresIn: '2h'
                        });
                    return res.status(200).json({
                        success: 'Welcome to the JWT Auth',
                        user:user.email,
                        token: JWTToken,
	                      userId: user.userId
                    });
                }
                return res.status(401).json({
                    error: 'Unauthorized Access'
                });
            });
        })
        .catch(error => {
            res.status(500).json({
                error: "Invalid email name"
            });
        });
});

/* ---- Update record ---- */

router.post('/editUser', function(req, res) {

	// var id = req.body.uid
	var newPassword = ''

	if(req.body.password){
		bcrypt.hash(req.body.password, 10, function(err, hash) {
			if (err) {
				return res.status(500).json({
					error: err
				});
			}else {
				User.update(
					{userId: req.body.uid},
					{
						email: req.body.email,
						password:hash
					},
					{upsert: true},
					function (err, updated) {
						if(err){}
						res.status(200).json({
						success: 'User updated'
						});
					});
				}
		})
	}else {
		User.update(
			{userId: req.body.uid},
			{
				email: req.body.email
			},
			{upsert: true},
			function (err, updated) {
				if(err){}
				res.status(200).json({
					success: 'User updated'
				});
			}
		);
	}



})
