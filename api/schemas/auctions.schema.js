const mongoose = require('mongoose');
const bid= require('./bids.schema')

const auctionSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String },
  file: { type: String },
  expiryTime: { type: Date },
  status: { 
    type: String, 
    enum : ['active', 'purchased'],
    default: 'active' 
  },
  bids:[{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref : 'User' 
    },
    address: { type: String },
    email: { type: String },
    xrpBid:{type: Number},
    fakBid: {type: Number}, 
    createdAt: {type: Date},
    is_winner: {type: Boolean, default: false}
  }]
},{versionKey: false });

module.exports = mongoose.model('auction', auctionSchema);