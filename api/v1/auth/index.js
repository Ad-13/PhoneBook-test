const { Router } = require('express');
var passport = require('passport');

const { paths: { LOGIN, REGISTER, CONFIRM } } = require('../../../constants');
const { validate } = require('../middlewares');
const { loginUserCtrl, registerUserCtrl, verifyUserCtrl } = require('./auth.controller');
const { registerUserValidation, loginUserValidation } = require('./auth.validation');

const router = Router();

router.get('/', (req, res) => {
  res.send('Auth');
});

router.get(`/${CONFIRM}/:confirmationCode`, verifyUserCtrl);
router.post(
  `/${LOGIN}`,
  validate(loginUserValidation),
  passport.authenticate('local'),
  loginUserCtrl
);
router.post(`/${REGISTER}`, validate(registerUserValidation), registerUserCtrl);

module.exports = router;
