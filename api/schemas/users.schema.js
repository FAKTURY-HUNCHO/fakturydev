var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  email: {type: String,
     required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      },
  password: {type: String
     // match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      },
  role: {type: String},
  client_id: {type: String},
  firstName: { type: String, default: ''},
  lastName: { type: String, default: ''},
  email_verified: { type: Boolean, default: false },
  xrplAddress: { type: String}
});

module.exports = mongoose.model('User', UserSchema);
