const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//var uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {type: String, required: [true, 'Please enter a username'], unique: true},
    password: {type: String, required: [true, 'Please enter a password']}
});

UserSchema.pre('save', async function () {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
//UserSchema.plugin(uniqueValidator);
const User = mongoose.model('User', UserSchema);
module.exports = User;  