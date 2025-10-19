const { Model, Schema } = require('cherry3');

const model = new Model('ertu-role', Schema({
    guild: String,
    role: String,
    isDeleted: Boolean,
    deletedTimestamp: Number,
    name: String,
    color: Number,
    position: Number,
    permissions: String,
    members: Array,
    icon: String,
    mentionable: Boolean,
    hoist: Boolean,
    channelOverwrites: Array
}), { $timestamps: true });

module.exports = model;