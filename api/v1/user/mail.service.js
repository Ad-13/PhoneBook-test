const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');
const { join } = require('path');
const jwt = require('jsonwebtoken');

const { host, confirmationMail } = require('../../../config');
const { paths: { AUTH, CONFIRM, API } } = require('../../../constants');

const transporter = nodemailer.createTransport({
  service: confirmationMail.service,
  auth: {
    user: confirmationMail.sender,
    pass: confirmationMail.pass
  }
});

const generateCode = email => jwt.sign(email, confirmationMail.tokenSecret);

const buildDefaultOptions = user => {
  return {
    from: confirmationMail.sender,
    to: user.email,
    subject: 'YO! Confirm Your Email!',
    html: nunjucks.render(
      join(__dirname, '../../../client/views/mails/confirm-email.njk'),
      {
        firstName: user.firstName,
        lastName: user.lastName,
        confirmLink: `${host}/${API}/${AUTH}/${CONFIRM}/${generateCode(user.email)}`,
      },
    ),
  };
};

exports.sendConfirmEmail = (user, additionOptions) => {
  transporter.sendMail(
    {
      ...buildDefaultOptions(user),
      ...additionOptions
    },
    function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }
  );
};
