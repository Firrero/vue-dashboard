const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const record = Schema({

	uid: {type: String,required:false},
	date: {type: Date, required: false},
	project: {type: String, required: false},
	activity: {type: String, required: false},
	hours: {type: Number, required: false},
	feature: {type: String, required: false},
	id: {type: String, required: false},
	extra: {type: String, required: false},
	userId: {type: String, required: true}

});

module.exports = mongoose.model('Record', record);