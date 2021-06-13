const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

const { confirmationMail: { tokenSecret } } = require('../../../config');

const UserModel = require('./user.model');

exports.getUserByEmailWithPassword = async email => {
  try {
    const user = await UserModel.findOne({ email })
      .select('+password')
      .lean()
      .exec();
    
    if (!user) {
      throw {
        code: 404,
        message: 'user not found'
      }
    }
  
    return user;
  } catch (error) {
    throw error;
  }
};

exports.compareUserPassword = (password, userPassword) => {
  if (!compareSync(password, userPassword)) {
    throw {
      code: 404,
      message: 'user not found'
    }
  }
};

exports.registerUser = async model => {
  try {
    return await UserModel.create(model);
  } catch (error) {
    if (error.code === 11000) {
      throw {
        code: 409,
        message: 'email exist',
      }
    }

    throw error;
  }
};

exports.setUserVerification = async confirmationCode => {
  try {
    const email = jwt.verify(confirmationCode, tokenSecret);
    await UserModel.updateOne({ email }, { emailVerified: true });
  } catch (error) {
    throw error;
  }
};

exports.getUserData = async userId => {
  try {
    const user = await UserModel.findById(userId)
      .select('-role -createdAt')
      .lean()
      .exec();
    
    if (!user) {
      throw {
        code: 404,
        message: 'user not found'
      }
    }
  
    return user;
  } catch (error) {
    throw error;
  }
};
