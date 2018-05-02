const mongoose = require('mongoose');

const record = mongoose.Schema({

	date: {type: String, required: false},
	project: {type: String, required: false},
	activity: {type: String, required: false},
	hours: {type: String, required: false},
	feature: {type: String, required: false},
	id: {type: String, required: false},
	extra: {type: String, required: false}

});

module.exports = mongoose.model('Record', record);