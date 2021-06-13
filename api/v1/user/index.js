const { Router } = require('express');
const router = Router();

const { paths: { PROFILE } } = require('../../../constants');
const { getUserProfileDataCtrl } = require('./user.controller');

router.get('/', (req, res) => {
  res.send('User');
});

router.get(`/${PROFILE}`, getUserProfileDataCtrl);

module.exports = router;
