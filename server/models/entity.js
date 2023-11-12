const mongoose = require('mongoose');


const entitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true
});

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
