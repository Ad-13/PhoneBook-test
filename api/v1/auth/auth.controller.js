const { sendConfirmEmail } = require('../user/mail.service');
const { getUserByEmailWithPassword, setUserVerification, registerUser, compareUserPassword } = require('../user/user.service');

exports.verifyUserCtrl = async (req, res, next) => {
  try {
    const { confirmationCode } = req.params;
    await setUserVerification(confirmationCode);
    res.send({ message: 'email confirmed'});
  } catch (error) {
    next(error);
  }
};

exports.loginUserCtrl = async (req, res, next) => {
  try {
    if (!req.user.emailVerified) {
      sendConfirmEmail(req.user); // ???
      throw {
        code: 401,
        message: 'email is not confirmed'
      }
    }

    res.send({ message: 'login success', user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.registerUserCtrl = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;
    const user = await registerUser({email, password, firstName, lastName, username});

    res.json({
      message: 'register success',
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
