const express = require('express');
// const bodyParser = require('body-parser');
const channelAuthController = require('../Controllers/channelAuthController');

const router = express.Router();
// router.use(bodyParser.json());
router.post('/signup', channelAuthController.signup);
router.post('/login', channelAuthController.login);
router.patch(
  '/updatePassword',
  channelAuthController.protect,
  channelAuthController.updatePassword
);

module.exports = router;
