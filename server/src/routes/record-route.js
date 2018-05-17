const express = require('express');
const router = express.Router();
const Record = require('../models/record');
const jwt = require('jsonwebtoken');

router.post('/removeRecord', function (req, res) {
	var uid = req.body.uid
	jwt.verify(req.body.token, 'secret', function (err, decoded) {
		if (err) {
			res.status(500).json({
				error: err
			});
		} else {
			if (uid) {
				Record.remove({$or: [{"uid": uid}, {"uid": "76"}]}, function (err, removed) {
					res.status(200).json({
						success: 'Record removed'
					});
				});
			}
		}
	})
})


router.post('/getStatistics', function (req, res) {
	var userId = req.body.uid
	jwt.verify(req.body.token, 'secret', function (err, decoded) {
		if (err) {
			res.status(500).json({
				error: err
			});
		} else {
			Record.find({userId: userId}, 'date hours activity ', function (err, records) {
				if (err) {
					console.log(err);
				} else {
					Record.count({userId: userId}, function (error, count) {
						res.json([records, count]);
					});
				}
			})
		}
	})
})


/* --- GET record --- */

router.post('/getRecord', function (req, res) {

	var query = req.body.query
	var userId = req.body.userId
	var sortBy = {}
	query.sort == 0 ? sortBy = 0 : sortBy[query.sort] = query.order
	jwt.verify(req.body.token, 'secret', function (err, decoded) {
		if (err) {
			res.status(500).json({
				error: err
			});
		} else {
			Record.find({userId: userId}, 'uid date project activity hours feature id extra', function (err, records) {
				if (err) {
					console.log(err);
				} else {
					Record.count({userId: userId}, function (error, count) {
						res.json([records, count]);
					});
				}
			}).skip(query.offset).limit(query.limit).sort(sortBy)
		}
	})
})

/*----- Register new record timesheet  ---- */
router.post('/create', function (req, res) {

	jwt.verify(req.body.token, 'secret', function (err, decoded) {
		if (err) {
			res.status(500).json({
				error: err
			});
		} else {
			Record.update(
				{uid: req.body.uid},
				{
					uid: req.body.uid,
					date: req.body.date,
					project: req.body.project,
					activity: req.body.activity,
					hours: req.body.hours,
					feature: req.body.feature,
					id: req.body.id,
					extra: req.body.extra,
					userId: req.body.userId
				},
				{upsert: true},
				function (err, updated) {
					if (err) {

					} else {
						res.status(200).json({
							success: 'Record updated'
						});
					}

				});
		}
	})

});

module.exports = router;