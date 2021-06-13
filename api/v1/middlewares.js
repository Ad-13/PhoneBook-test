const { celebrate } = require('celebrate');
const { getUserData } = require('./user/user.service');

exports.isAuthorized = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next ({
      code: 401,
      message: 'unauthorized'
    });
  }

  req.session.prevEnterDate = req.session.enterDate || Date.now();
  req.session.enterDate = Date.now();
  next();
};

exports.validate = (schema, options = {}) => {
  return celebrate(
    schema,
    {
      ...options,
      stripUnknown: {
        objects: true,
      }
    }
  );
};
