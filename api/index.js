const { Router } = require('express');
const { paths: { V1 } } = require('../constants');
const router = Router();
const v1 = require('./v1');

router.use(`/${V1}`, v1);
router.use(`/`, v1);

module.exports = router;
