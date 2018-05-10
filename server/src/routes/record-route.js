const express = require('express');
const router = express.Router();
const Record = require('../models/record');

router.post('/removeRecord', function(req, res){
	var uid = req.body.uid
	if(uid){
		Record.remove({ $or : [  {"uid": uid}, { "uid": "76" } ] }, function(err,removed) {
			res.status(200).json({
				success: 'Record removed'
			});
		});
	}

})

/* ---- Update record ---- */
/*
router.post('/editRecord', function(req, res) {

	var id = req.body.uid

	Record.update(
		{uid: '_otfdpe7ycdgoption 2'},
		{
			date: req.body.date,
			project: req.body.project,
			activity: req.body.activity,
			hours: req.body.hours,
			feature: req.body.feature,
			id: req.body.id,
			extra: "extra"
		},
		{upsert: true},
		function (err, updated) {
			if(err){}
			res.status(200).json({
				success: 'Record updated'+id
			});
		});
})
*/
/* --- GET statistic --- */

router.post('/getStatistics', function(req, res) {
	var userId = req.body.uid
	Record.find({userId:userId},'date hours activity ', function(err, records){
		if(err){
			console.log(err);
		} else{
			Record.count({userId:userId}, function (error, count) {
				res.json([records,count]);
			});
		}
	})
})



/* --- GET record --- */

router.post('/getRecord', function(req, res) {

	var query = req.body.query
	var userId = req.body.userId
	var sortBy = {}
	query.sort == 0 ? sortBy = 0: sortBy[query.sort] = query.order

	Record.find({userId:userId},'uid date project activity hours feature id extra', function(err, records){
		if(err){
			console.log(err);
		} else{
			Record.count({userId:userId}, function (error, count) {
				res.json([records,count]);
			});
		}
	}).skip(query.offset).limit(query.limit).sort(sortBy)
})

/*----- Register new record timesheet  ---- */
router.post('/create', function(req, res){

	//var ID = '_' + Math.random().toString(36).substr(2, 14);


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
			if(err){

			}else {
				res.status(200).json({
					success: 'Record updated'
				});
			}

		});
	/*const record = new Record({
		uid: ID+req.body.date,
		date: req.body.date,
		project: req.body.project,
		activity: req.body.activity,
		hours: req.body.hours,
		feature: req.body.feature,
		id: req.body.id,
		extra: req.body.extra

	});
	record.save().then(function(result) {
		res.status(200).json({
			success: 'New record has been created'
		});
	})*/

});

module.exports = router;