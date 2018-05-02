const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Record = require('../models/record');

const jwt = require('jsonwebtoken');

router.get('/getUser', function(req, res) {
	Record.find({},'date project activity hours feature id extra', function(err, users){
		if(err){
			console.log(err);
		} else{
			res.send(
				users
			);
		}
	})
})

router.get('/getUsers', function(req, res) {
	res.send(

		[
			{
				'date':"14.04.2018",
				'project':"Android game",
				'activity':"Dev",
				'hours':"3.5",
				'feature':'13',
				'id':"id",
				'extra':"mail@mail.com"
			},
			{
				'date':"4.08.2018",
				'project':"Valentin",
				'activity':"Popov",
				'hours':"mail@mail.com",
				'feature':'13',
				'id':"Popov",
				'extra':"mail@mail.com"
			},
			{
				'date':"13.01.2018",
				'project':"Valentin",
				'activity':"Popov",
				'hours':"mail@mail.com",
				'feature':'13',
				'id':"Popov",
				'extra':"mail@mail.com"
			}
		]

	)
});

/*----- Register new timesheet  ---- */
router.post('/create', function(req, res){
	const record = new Record({
		date: '13.03.2018',
		project: req.body.project,
		activity: req.body.activity,
		hours: req.body.hours,
		feature: req.body.feature,
		id: req.body.id,
		extra: req.body.extra
	});
	record.save().then(function(result) {
		console.log("result!");
		res.status(200).json({
			success: 'New record has been created'
		});
	})

});

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
						password: hash
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
                        token: JWTToken
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