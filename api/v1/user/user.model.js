const { Schema, model } = require('mongoose');
const { hashSync } = require('bcrypt');

const { SALT_ROUNDS } = require('../../../config');
const { roles } = require('../../../constants');
const { sendConfirmEmail } = require('./mail.service');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: roles.USER,
      enum: [roles.ADMIN, roles.USER],
    },
    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      trim: true,
      default: Date.now(),
    },
  },
  {
    collection: 'users',
  },
);

const isNewSymbol = Symbol('isNew');

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, SALT_ROUNDS);
  }

  this[isNewSymbol] = this.isNew;
  next();
});

UserSchema.post('save', function(doc, next) {
  try {
    if (this[isNewSymbol]) {
      sendConfirmEmail(doc);
    }
  } catch (error) {
    console.error(error);
  } finally {
    next();
  }
});

const UserModel = model('UserModel', UserSchema);

module.exports = UserModel;
