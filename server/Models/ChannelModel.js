const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const channelSchema = mongoose.Schema({
  channelUserName: {
    type: String,
    unique: true,
    required: [true, 'Please Provide Your Channel Username']
  },
  channelPasswd: {
    type: String,
    required: [true, 'Please Provide Your Channel Password'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Provide your name ']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    validators: [validator.isEmail, 'Please Provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This works onlly on create or save
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  TYPE: {
    type: String,
    default: 'Channel'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

channelSchema.pre('save', async function(next) {
  //initiate the password encryption  method inly if password is updated or created
  //if nothing has happened to password , i.e password is not modified then no need to do the encryption process
  if (!this.isModified('password')) return next();
  // 12 here represents how strong should be the encryption
  //more value, more strong encryption, more computation time
  this.password = await bcrypt.hash(this.password, 12); //hash functin here is a promise

  //delete passwordconfirm field as we just want password confirmation for the validation and we don't want to store it in
  // the database
  this.passwordConfirm = undefined;
  next();
});

channelSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

channelSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

channelSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

channelSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mins
  return resetToken;
};

const Channel = mongoose.model('channels', channelSchema);
module.exports = Channel;
