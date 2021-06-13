const { Router } = require('express');
const { paths: { AUTH, USER } } = require('../../constants');
const router = Router();
const auth = require('./auth');
const user = require('./user');
const { isAuthorized } = require('./middlewares');

router.use(`/${AUTH}`, auth);

router.use( `/${USER}`, isAuthorized, user);

module.exports = router;
