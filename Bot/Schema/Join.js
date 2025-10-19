const mongoose = require('mongoose');

const model = mongoose.model('ertu-join', mongoose.Schema({
    id: String,
    voice: Number,
    stream: Number,
    camera: Number,
}));

module.exports = model;